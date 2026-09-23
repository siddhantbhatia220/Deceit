import { z } from 'zod';
import { ImposterHintMode, TieRule, ClueOrder, GamePresetId } from '@deceit/config';

export type { ImposterHintMode, TieRule, ClueOrder, GamePresetId };

// --------------------------------------------------------
// Game State Lifecycle Machine (Secret-Word Party Game)
// --------------------------------------------------------
export const GamePhaseSchema = z.enum([
  'LOBBY',
  'STARTING',
  'WORD_ASSIGNMENT',
  'ROLE_REVEAL',
  'CLUE_PHASE',
  'DISCUSSION',
  'VOTING',
  'VOTE_RESULT',
  'IMPOSTER_GUESS',
  'ROUND_RESULT',
  'NEXT_ROUND',
  'GAME_RESULT',
]);

export type GamePhase = z.infer<typeof GamePhaseSchema>;

// --------------------------------------------------------
// Roles (Strictly Civilian & Imposter)
// --------------------------------------------------------
export const PlayerRoleSchema = z.enum([
  'CIVILIAN',
  'IMPOSTER',
]);

export type PlayerRole = z.infer<typeof PlayerRoleSchema>;

export interface PlayerPublicInfo {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  isAlive: boolean;
  isBot: boolean;
  botPersonality?: 'balanced' | 'aggressive' | 'quiet' | 'analytical' | 'bluffer';
  hasSubmittedClue: boolean;
  hasVoted: boolean;
  score: number;
}

export interface PlayerSecretInfo {
  role: PlayerRole;
  secretWord?: string;
  category?: string;
  hint?: string;
  knownCoImposters?: string[];
}

// --------------------------------------------------------
// Clues & Voting
// --------------------------------------------------------
export interface ClueEntry {
  id: string;
  playerId: string;
  playerName: string;
  roundNumber: number;
  text: string;
  timestamp: number;
  isAnonymous?: boolean;
}

export interface VoteRecord {
  voterId: string;
  targetPlayerId: string | 'SKIP';
}

export interface VoteResult {
  eliminatedPlayerId: string | null;
  eliminatedPlayerName: string | null;
  eliminatedRole: PlayerRole | null;
  isTie: boolean;
  tallies: Record<string, number>;
}

// --------------------------------------------------------
// Game Settings Schema (Validated)
// --------------------------------------------------------
export const GameSettingsSchema = z.object({
  maxPlayers: z.number().min(3).max(24).default(12),
  imposterCount: z.number().min(1).max(4).default(1),
  impostersKnowEachOther: z.boolean().default(false),
  wordPackId: z.string().default('pack-movies-cinema'),
  customCategory: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  imposterHintMode: z.enum(['NONE', 'CATEGORY', 'CATEGORY_AND_HINT']).default('CATEGORY'),
  clueOrder: z.enum(['SEQUENTIAL', 'RANDOM', 'ROTATING']).default('SEQUENTIAL'),
  clueTimerSeconds: z.number().min(10).max(120).default(30),
  discussionTimerSeconds: z.number().min(10).max(180).default(60),
  votingTimerSeconds: z.number().min(10).max(90).default(30),
  imposterGuessTimerSeconds: z.number().min(10).max(60).default(30),
  anonymousVoting: z.boolean().default(false),
  imposterWordGuess: z.boolean().default(true),
  tieRule: z.enum(['REVOTE', 'NO_ELIMINATION', 'RANDOM', 'IMPOSTER_WINS']).default('NO_ELIMINATION'),
  roundsToWin: z.number().min(1).max(10).default(3),
});

export type GameSettings = z.infer<typeof GameSettingsSchema>;

// --------------------------------------------------------
// Word Pack Types
// --------------------------------------------------------
export interface WordItem {
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
  tags: string[];
}

export interface WordPack {
  id: string;
  title: string;
  description: string;
  category: string;
  isOfficial: boolean;
  createdBy: string;
  downloads: number;
  likes: number;
  words: WordItem[];
}

// --------------------------------------------------------
// Sanitized Game State (Authorized Client View)
// --------------------------------------------------------
export interface ClientGameState {
  roomCode: string;
  phase: GamePhase;
  phaseEndTime: number | null;
  phaseDurationSeconds: number;
  currentRound: number;
  totalRounds: number;
  currentTurnPlayerId: string | null;
  clueOrderPlayerIds: string[];
  players: PlayerPublicInfo[];
  clues: ClueEntry[];
  settings: GameSettings;
  myInfo: PlayerSecretInfo;
  lastVoteResult: VoteResult | null;
  imposterGuess: {
    guessedWord: string | null;
    isCorrect: boolean | null;
    imposterPlayerId: string | null;
  } | null;
  winnerTeam: 'CIVILIAN' | 'IMPOSTER' | null;
  winReason: string | null;
  secretWordRevealed: string | null;
}

// --------------------------------------------------------
// WebSocket Typed Event Contracts
// --------------------------------------------------------
export interface ServerToClientEvents {
  'game:state': (state: ClientGameState) => void;
  'room:error': (error: { code: string; message: string }) => void;
  'chat:message': (message: {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
    channel: 'GLOBAL' | 'LOBBY' | 'DEAD';
  }) => void;
}

export interface ClientToServerEvents {
  'room:create': (payload: { username: string; avatar?: string; settings?: Partial<GameSettings> }, callback: (response: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  'room:join': (payload: { roomCode: string; username: string; avatar?: string }, callback: (response: { success: boolean; error?: string }) => void) => void;
  'room:leave': () => void;
  'room:update_settings': (payload: Partial<GameSettings>) => void;
  'player:toggle_ready': () => void;
  'player:add_bot': (payload: { personality?: 'balanced' | 'aggressive' | 'quiet' | 'analytical' | 'bluffer' }) => void;
  'player:remove_bot': (payload: { botId: string }) => void;
  'player:kick': (payload: { targetPlayerId: string }) => void;
  'game:start': () => void;
  'game:clue_submit': (payload: { text: string }) => void;
  'game:vote_submit': (payload: { targetPlayerId: string | 'SKIP' }) => void;
  'game:imposter_guess': (payload: { guessedWord: string }) => void;
  'game:rematch': () => void;
  'chat:send': (payload: { text: string }) => void;
}
