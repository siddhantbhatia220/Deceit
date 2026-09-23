import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { APP_CONFIG } from '@deceit/config';
import { GameEngine, AIBotEngine, BUILTIN_WORD_PACKS } from '@deceit/game-engine';
import { GameSettings } from '@deceit/game-types';

const PORT = Number(process.env.PORT) || 4000;

// Active Games in-memory
const rooms = new Map<string, GameEngine>();
const socketToPlayerMap = new Map<string, { roomCode: string; playerId: string; username: string }>();

// Timer management
const roomTimers = new Map<string, NodeJS.Timeout>();

export async function createServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, {
    origin: '*',
  });

  // REST API Routes
  fastify.get('/health', async () => {
    return {
      status: 'healthy',
      app: APP_CONFIG.name,
      version: APP_CONFIG.version,
      poweredBy: APP_CONFIG.poweredBy,
      timestamp: new Date().toISOString(),
      activeRooms: rooms.size,
    };
  });

  fastify.get(`${APP_CONFIG.apiPrefix}/word-packs`, async () => {
    return {
      success: true,
      packs: BUILTIN_WORD_PACKS,
    };
  });

  fastify.get(`${APP_CONFIG.apiPrefix}/presets`, async () => {
    return {
      success: true,
      presets: Object.values(APP_CONFIG.gamePresets),
    };
  });

  await fastify.ready();
  const server = fastify.server;

  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  function broadcastGameState(game: GameEngine) {
    const room = io.sockets.adapter.rooms.get(game.roomCode);
    if (!room) return;

    for (const socketId of room) {
      const mapping = socketToPlayerMap.get(socketId);
      if (mapping && mapping.roomCode === game.roomCode) {
        const sanitized = game.sanitizeForPlayer(mapping.playerId);
        io.to(socketId).emit('game:state', sanitized);
      }
    }
  }

  function handlePhaseTransition(game: GameEngine) {
    if (roomTimers.has(game.roomCode)) {
      clearTimeout(roomTimers.get(game.roomCode)!);
      roomTimers.delete(game.roomCode);
    }

    // Bot Action handling
    if (game.phase === 'CLUE_PHASE') {
      const currentTurnId = game.clueOrderPlayerIds[game.currentTurnIndex % game.clueOrderPlayerIds.length];
      const turnPlayer = game.players.get(currentTurnId);

      if (turnPlayer && turnPlayer.isBot && turnPlayer.isAlive && !turnPlayer.clueSubmitted) {
        setTimeout(() => {
          if (game.phase === 'CLUE_PHASE' && game.currentWordItem) {
            const botClue = AIBotEngine.generateBotClue(
              turnPlayer.role,
              game.currentWordItem,
              game.clues,
              turnPlayer.botPersonality || 'balanced'
            );
            game.submitClue(turnPlayer.id, botClue);
            broadcastGameState(game);
            handlePhaseTransition(game);
          }
        }, 1800);
      }
    } else if (game.phase === 'VOTING') {
      const aliveBots = Array.from(game.players.values()).filter((p) => p.isAlive && p.isBot && !p.votedTarget);
      aliveBots.forEach((bot) => {
        setTimeout(() => {
          if (game.phase === 'VOTING') {
            const aliveIds = Array.from(game.players.values())
              .filter((p) => p.isAlive)
              .map((p) => p.id);
            const botVote = AIBotEngine.decideBotVote(bot.id, bot.role, aliveIds, game.clues);
            game.submitVote(bot.id, botVote);
            broadcastGameState(game);
            handlePhaseTransition(game);
          }
        }, 1200 + Math.random() * 2000);
      });
    }

    // Phase Timer
    if (game.phaseDurationSeconds > 0) {
      const timer = setTimeout(() => {
        if (game.phase === 'ROLE_REVEAL') {
          game.setPhase('CLUE_PHASE', game.settings.clueTimerSeconds);
        } else if (game.phase === 'CLUE_PHASE') {
          game.setPhase('DISCUSSION', game.settings.discussionTimerSeconds);
        } else if (game.phase === 'DISCUSSION') {
          game.setPhase('VOTING', game.settings.votingTimerSeconds);
        } else if (game.phase === 'VOTING') {
          game.resolveVotingPhase();
        } else if (game.phase === 'ROUND_RESULT') {
          game.setPhase('CLUE_PHASE', game.settings.clueTimerSeconds);
        } else if (game.phase === 'IMPOSTER_GUESS') {
          game.checkWinConditions();
        }
        broadcastGameState(game);
        handlePhaseTransition(game);
      }, game.phaseDurationSeconds * 1000);

      roomTimers.set(game.roomCode, timer);
    }
  }

  // Socket.IO Handlers
  io.on('connection', (socket) => {
    fastify.log.info(`Client connected: ${socket.id}`);

    socket.on('room:create', (payload, callback) => {
      try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const playerId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const game = new GameEngine(code, { id: playerId, name: payload.username, avatar: payload.avatar }, payload.settings);
        rooms.set(code, game);

        socket.join(code);
        socketToPlayerMap.set(socket.id, { roomCode: code, playerId, username: payload.username });

        callback({ success: true, roomCode: code });
        broadcastGameState(game);
      } catch (err: any) {
        callback({ success: false, error: err.message || 'Failed to create room' });
      }
    });

    socket.on('room:join', (payload, callback) => {
      try {
        const code = payload.roomCode.toUpperCase();
        const game = rooms.get(code);
        if (!game) {
          return callback({ success: false, error: 'Room not found' });
        }

        const playerId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const added = game.addPlayer(playerId, payload.username, payload.avatar || 'avatar-1');
        if (!added) {
          return callback({ success: false, error: 'Room is full' });
        }

        socket.join(code);
        socketToPlayerMap.set(socket.id, { roomCode: code, playerId, username: payload.username });

        callback({ success: true });
        broadcastGameState(game);
      } catch (err: any) {
        callback({ success: false, error: err.message || 'Failed to join room' });
      }
    });

    socket.on('player:add_bot', (payload) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game || game.phase !== 'LOBBY') return;

      const botId = `bot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const botNames = ['Alex Shadow', 'Morgan Bluff', 'Riley Cipher', 'Jordan Echo', 'Sam Nova', 'Taylor Atlas'];
      const botName = botNames[game.players.size % botNames.length] || `Bot ${game.players.size + 1}`;
      
      game.addPlayer(botId, botName, 'avatar-bot', false, true);
      const botPlayer = game.players.get(botId);
      if (botPlayer) {
        botPlayer.botPersonality = payload.personality || 'balanced';
      }
      broadcastGameState(game);
    });

    socket.on('player:remove_bot', (payload) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game || game.phase !== 'LOBBY') return;

      game.removePlayer(payload.botId);
      broadcastGameState(game);
    });

    socket.on('room:update_settings', (newSettings: Partial<GameSettings>) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game || game.phase !== 'LOBBY') return;

      game.updateSettings(newSettings);
      broadcastGameState(game);
    });

    socket.on('player:toggle_ready', () => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      const p = game.players.get(mapping.playerId);
      if (p) {
        p.isReady = !p.isReady;
        broadcastGameState(game);
      }
    });

    socket.on('game:start', () => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      const success = game.startGame();
      if (success) {
        broadcastGameState(game);
        handlePhaseTransition(game);
      }
    });

    socket.on('game:clue_submit', (payload) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      const ok = game.submitClue(mapping.playerId, payload.text);
      if (ok) {
        broadcastGameState(game);
        handlePhaseTransition(game);
      }
    });

    socket.on('game:vote_submit', (payload) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      const ok = game.submitVote(mapping.playerId, payload.targetPlayerId);
      if (ok) {
        broadcastGameState(game);
        handlePhaseTransition(game);
      }
    });

    socket.on('game:imposter_guess', (payload) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      const ok = game.submitImposterGuess(mapping.playerId, payload.guessedWord);
      if (ok) {
        broadcastGameState(game);
        handlePhaseTransition(game);
      }
    });

    socket.on('game:rematch', () => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      game.setPhase('LOBBY', 0);
      game.clues = [];
      game.lastVoteResult = null;
      game.imposterGuess = null;
      game.winnerTeam = null;
      game.players.forEach((p) => {
        p.isAlive = true;
        p.isReady = p.isHost;
        p.clueSubmitted = undefined;
        p.votedTarget = undefined;
      });
      broadcastGameState(game);
    });

    socket.on('chat:send', (payload) => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (!mapping) return;
      const game = rooms.get(mapping.roomCode);
      if (!game) return;

      const player = game.players.get(mapping.playerId);
      const isDead = player ? !player.isAlive : false;

      io.to(mapping.roomCode).emit('chat:message', {
        id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        senderId: mapping.playerId,
        senderName: mapping.username,
        text: payload.text.slice(0, 200),
        timestamp: Date.now(),
        channel: isDead ? 'DEAD' : 'GLOBAL',
      });
    });

    socket.on('disconnect', () => {
      const mapping = socketToPlayerMap.get(socket.id);
      if (mapping) {
        const game = rooms.get(mapping.roomCode);
        if (game) {
          const p = game.players.get(mapping.playerId);
          if (p) p.isConnected = false;
          broadcastGameState(game);
        }
        socketToPlayerMap.delete(socket.id);
      }
    });
  });

  return { fastify, server };
}

if (process.env.NODE_ENV !== 'test') {
  createServer().then(({ server }) => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[DECEIT API] Server running at http://0.0.0.0:${PORT}`);
    });
  });
}
