import {
  GamePhase,
  PlayerRole,
  GameSettings,
  GameSettingsSchema,
  PlayerPublicInfo,
  PlayerSecretInfo,
  ClientGameState,
  ClueEntry,
  VoteRecord,
  VoteResult,
  WordItem,
} from '@deceit/game-types';
import { WordEngine, BUILTIN_WORD_PACKS } from './WordEngine.js';
import { RoleAssignmentEngine } from './RoleAssignmentEngine.js';
import { VotingEngine } from './VotingEngine.js';
import { AIBotEngine } from './AIBotEngine.js';

export interface InternalPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  isAlive: boolean;
  isBot: boolean;
  botPersonality?: 'balanced' | 'aggressive' | 'quiet' | 'analytical' | 'bluffer';
  role: PlayerRole;
  score: number;
  clueSubmitted?: string;
  votedTarget?: string | 'SKIP';
}

export class GameEngine {
  public roomCode: string;
  public phase: GamePhase = 'LOBBY';
  public phaseEndTime: number | null = null;
  public phaseDurationSeconds: number = 0;
  public currentRound: number = 0;
  public totalRounds: number = 3;
  public currentTurnIndex: number = 0;
  public clueOrderPlayerIds: string[] = [];
  public players: Map<string, InternalPlayer> = new Map();
  public clues: ClueEntry[] = [];
  public settings: GameSettings;
  public wordEngine: WordEngine;
  public currentWordItem: WordItem | null = null;
  public lastVoteResult: VoteResult | null = null;
  public imposterGuess: {
    guessedWord: string | null;
    isCorrect: boolean | null;
    imposterPlayerId: string | null;
  } | null = null;
  public winnerTeam: 'CIVILIAN' | 'IMPOSTER' | null = null;
  public winReason: string | null = null;

  constructor(roomCode: string, hostPlayer: { id: string; name: string; avatar?: string }, initialSettings?: Partial<GameSettings>) {
    this.roomCode = roomCode.toUpperCase();
    this.settings = GameSettingsSchema.parse(initialSettings || {});
    this.totalRounds = this.settings.roundsToWin;
    this.wordEngine = new WordEngine(BUILTIN_WORD_PACKS);

    this.addPlayer(hostPlayer.id, hostPlayer.name, hostPlayer.avatar || 'avatar-1', true);
  }

  public addPlayer(id: string, name: string, avatar: string = 'avatar-1', isHost: boolean = false, isBot: boolean = false): boolean {
    if (this.players.size >= this.settings.maxPlayers && !this.players.has(id)) {
      return false;
    }
    const existing = this.players.get(id);
    if (existing) {
      existing.isConnected = true;
      return true;
    }
    this.players.set(id, {
      id,
      name,
      avatar,
      isHost,
      isReady: isHost,
      isConnected: true,
      isAlive: true,
      isBot,
      role: 'CIVILIAN',
      score: 0,
    });
    return true;
  }

  public removePlayer(id: string): void {
    const player = this.players.get(id);
    if (!player) return;

    this.players.delete(id);

    // Host transfer
    if (player.isHost && this.players.size > 0) {
      const nextHost = this.players.values().next().value;
      if (nextHost) nextHost.isHost = true;
    }
  }

  public updateSettings(newSettings: Partial<GameSettings>): void {
    if (this.phase !== 'LOBBY') return;
    this.settings = GameSettingsSchema.parse({ ...this.settings, ...newSettings });
    this.totalRounds = this.settings.roundsToWin;
  }

  public startGame(): boolean {
    if (this.phase !== 'LOBBY') return false;
    if (this.players.size < 3) return false;

    // Pick secret word
    this.currentWordItem = this.wordEngine.pickRandomWord(this.settings.wordPackId, this.settings.difficulty);

    // Assign civilian and imposter roles
    const playerIds = Array.from(this.players.keys());
    const roleMap = RoleAssignmentEngine.assignRoles(playerIds, this.settings.imposterCount);

    for (const [id, role] of roleMap.entries()) {
      const p = this.players.get(id);
      if (p) {
        p.role = role;
        p.isAlive = true;
        p.clueSubmitted = undefined;
        p.votedTarget = undefined;
      }
    }

    this.currentRound = 1;
    this.clues = [];
    this.lastVoteResult = null;
    this.imposterGuess = null;
    this.winnerTeam = null;
    this.winReason = null;

    // Setup Clue Order
    this.computeClueOrder();

    this.setPhase('ROLE_REVEAL', 6);
    return true;
  }

  private computeClueOrder(): void {
    const aliveIds = Array.from(this.players.values()).filter((p) => p.isAlive).map((p) => p.id);
    if (this.settings.clueOrder === 'RANDOM') {
      this.clueOrderPlayerIds = [...aliveIds].sort(() => Math.random() - 0.5);
    } else if (this.settings.clueOrder === 'ROTATING') {
      const shift = (this.currentRound - 1) % aliveIds.length;
      this.clueOrderPlayerIds = [...aliveIds.slice(shift), ...aliveIds.slice(0, shift)];
    } else {
      this.clueOrderPlayerIds = aliveIds;
    }
    this.currentTurnIndex = 0;
  }

  public setPhase(phase: GamePhase, durationSeconds: number): void {
    this.phase = phase;
    this.phaseDurationSeconds = durationSeconds;
    this.phaseEndTime = durationSeconds > 0 ? Date.now() + durationSeconds * 1000 : null;

    if (phase === 'CLUE_PHASE') {
      this.computeClueOrder();
    }
  }

  public submitClue(playerId: string, text: string): boolean {
    if (this.phase !== 'CLUE_PHASE') return false;
    const player = this.players.get(playerId);
    if (!player || !player.isAlive || player.clueSubmitted) return false;

    const trimmed = text.trim().slice(0, 100);
    if (!trimmed) return false;

    player.clueSubmitted = trimmed;
    this.clues.push({
      id: `clue-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      playerId: player.id,
      playerName: player.name,
      roundNumber: this.currentRound,
      text: trimmed,
      timestamp: Date.now(),
      isAnonymous: this.settings.anonymousVoting,
    });

    // Advance turn or phase if all alive players submitted
    const alivePlayers = Array.from(this.players.values()).filter((p) => p.isAlive);
    const allSubmitted = alivePlayers.every((p) => p.clueSubmitted !== undefined);

    if (allSubmitted) {
      this.setPhase('DISCUSSION', this.settings.discussionTimerSeconds);
    } else {
      this.currentTurnIndex++;
    }
    return true;
  }

  public submitVote(voterId: string, targetPlayerId: string | 'SKIP'): boolean {
    if (this.phase !== 'VOTING') return false;
    const voter = this.players.get(voterId);
    if (!voter || !voter.isAlive) return false;

    voter.votedTarget = targetPlayerId;

    const alivePlayers = Array.from(this.players.values()).filter((p) => p.isAlive);
    const allVoted = alivePlayers.every((p) => p.votedTarget !== undefined);

    if (allVoted) {
      this.resolveVotingPhase();
    }
    return true;
  }

  public resolveVotingPhase(): void {
    const alivePlayers = Array.from(this.players.values()).filter((p) => p.isAlive);
    const votes: VoteRecord[] = alivePlayers.map((p) => ({
      voterId: p.id,
      targetPlayerId: p.votedTarget || 'SKIP',
    }));

    const roleMap = new Map<string, PlayerRole>();
    const nameMap = new Map<string, string>();
    this.players.forEach((p, id) => {
      roleMap.set(id, p.role);
      nameMap.set(id, p.name);
    });

    const voteResult = VotingEngine.resolveVotes(
      votes,
      alivePlayers.map((p) => p.id),
      roleMap,
      nameMap,
      this.settings.tieRule
    );

    this.lastVoteResult = voteResult;

    if (voteResult.eliminatedPlayerId) {
      const elim = this.players.get(voteResult.eliminatedPlayerId);
      if (elim) {
        elim.isAlive = false;

        // Imposter eliminated & final guess is enabled
        if (elim.role === 'IMPOSTER' && this.settings.imposterWordGuess) {
          this.setPhase('IMPOSTER_GUESS', this.settings.imposterGuessTimerSeconds);
          return;
        }
      }
    }

    this.checkWinConditions();
  }

  public submitImposterGuess(imposterPlayerId: string, guessedWord: string): boolean {
    if (this.phase !== 'IMPOSTER_GUESS') return false;
    const isCorrect = this.currentWordItem
      ? guessedWord.trim().toUpperCase() === this.currentWordItem.word.toUpperCase()
      : false;

    this.imposterGuess = {
      guessedWord,
      isCorrect,
      imposterPlayerId,
    };

    if (isCorrect) {
      this.winnerTeam = 'IMPOSTER';
      this.winReason = `The Imposter successfully deduced the secret word: ${this.currentWordItem?.word}!`;
      this.setPhase('GAME_RESULT', 0);
    } else {
      this.checkWinConditions();
    }
    return true;
  }

  public checkWinConditions(): void {
    const aliveImposters = Array.from(this.players.values()).filter(
      (p) => p.isAlive && p.role === 'IMPOSTER'
    );
    const aliveCivilians = Array.from(this.players.values()).filter(
      (p) => p.isAlive && p.role === 'CIVILIAN'
    );

    if (aliveImposters.length === 0) {
      this.winnerTeam = 'CIVILIAN';
      this.winReason = 'All Imposters were caught by the group!';
      this.setPhase('GAME_RESULT', 0);
      return;
    }

    if (aliveImposters.length >= aliveCivilians.length) {
      this.winnerTeam = 'IMPOSTER';
      this.winReason = 'Imposters have taken control of the room!';
      this.setPhase('GAME_RESULT', 0);
      return;
    }

    if (this.currentRound >= this.totalRounds) {
      this.winnerTeam = 'IMPOSTER';
      this.winReason = 'Civilians ran out of rounds without catching the Imposter!';
      this.setPhase('GAME_RESULT', 0);
      return;
    }

    // Advance to next round
    this.currentRound++;
    this.players.forEach((p) => {
      p.clueSubmitted = undefined;
      p.votedTarget = undefined;
    });
    this.setPhase('ROUND_RESULT', 4);
  }

  public sanitizeForPlayer(requestingPlayerId: string): ClientGameState {
    const player = this.players.get(requestingPlayerId);
    const role = player?.role || 'CIVILIAN';

    const publicPlayers: PlayerPublicInfo[] = Array.from(this.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isHost: p.isHost,
      isReady: p.isReady,
      isConnected: p.isConnected,
      isAlive: p.isAlive,
      isBot: p.isBot,
      botPersonality: p.botPersonality,
      hasSubmittedClue: p.clueSubmitted !== undefined,
      hasVoted: p.votedTarget !== undefined,
      score: p.score,
    }));

    const isGameOver = this.phase === 'GAME_RESULT';

    const allImposters = Array.from(this.players.values())
      .filter((p) => p.role === 'IMPOSTER')
      .map((p) => p.id);

    const mySecret: PlayerSecretInfo = this.currentWordItem
      ? RoleAssignmentEngine.buildPlayerSecretInfo(
          role,
          this.currentWordItem,
          this.settings.imposterHintMode,
          this.settings.impostersKnowEachOther,
          allImposters
        )
      : { role: 'CIVILIAN' };

    const currentTurnId = this.clueOrderPlayerIds[this.currentTurnIndex % Math.max(1, this.clueOrderPlayerIds.length)] || null;

    return {
      roomCode: this.roomCode,
      phase: this.phase,
      phaseEndTime: this.phaseEndTime,
      phaseDurationSeconds: this.phaseDurationSeconds,
      currentRound: this.currentRound,
      totalRounds: this.totalRounds,
      currentTurnPlayerId: currentTurnId,
      clueOrderPlayerIds: this.clueOrderPlayerIds,
      players: publicPlayers,
      clues: this.clues,
      settings: this.settings,
      myInfo: mySecret,
      lastVoteResult: this.lastVoteResult,
      imposterGuess: this.imposterGuess,
      winnerTeam: this.winnerTeam,
      winReason: this.winReason,
      secretWordRevealed: isGameOver ? this.currentWordItem?.word || null : null,
    };
  }
}
