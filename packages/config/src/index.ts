/**
 * Centralized Brand & Application Configuration for DECEIT.
 * Secret-Word Imposter Party Game.
 * Red & Black Visual Identity.
 */

export const APP_CONFIG = {
  name: 'DECEIT',
  tagline: 'Think. Bluff. Deceive. Survive.',
  version: '0.1.0',
  description: 'Production-ready real-time multiplayer secret-word imposter party game',
  poweredBy: 'Powered by Ares',
  author: 'DECEIT Engineering Team',
  homepage: 'https://deceit.game',
  apiPrefix: '/api/v1',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr', 'de', 'hi', 'ja'] as const,
  reconnectGracePeriodMs: 30000,
  heartbeatIntervalMs: 5000,
  maxPlayersDefault: 12,
  minPlayersDefault: 3,
  defaultRoomCodeLength: 6,
  limits: {
    maxRoomCodeLength: 8,
    minUsernameLength: 2,
    maxUsernameLength: 20,
    maxClueLength: 100,
    maxChatLength: 200,
    defaultClueTimerSeconds: 30,
    defaultDiscussionTimerSeconds: 60,
    defaultVotingTimerSeconds: 30,
    defaultImposterGuessTimerSeconds: 30,
  },
  roles: {
    CIVILIAN: {
      id: 'CIVILIAN',
      name: 'Civilian',
      team: 'CIVILIAN',
      color: '#FFFFFF',
      description: 'Knows the secret word. Give subtle clues to prove you know it without making it obvious to the Imposter.',
    },
    IMPOSTER: {
      id: 'IMPOSTER',
      name: 'Imposter',
      team: 'IMPOSTER',
      color: '#E50914',
      description: 'Does not know the secret word. Blend in with clever clues, read other players, and guess the word to win.',
    },
  },
  imposterHintModes: {
    NONE: { id: 'NONE', name: 'No Hint', description: 'Imposter receives zero information.' },
    CATEGORY: { id: 'CATEGORY', name: 'Category Only', description: 'Imposter receives only the broad category.' },
    CATEGORY_AND_HINT: { id: 'CATEGORY_AND_HINT', name: 'Category + Vague Hint', description: 'Imposter receives category and a subtle hint.' },
  },
  clueOrders: {
    SEQUENTIAL: { id: 'SEQUENTIAL', name: 'Sequential', description: 'Players give clues in lobby order.' },
    RANDOM: { id: 'RANDOM', name: 'Random', description: 'Clue order is randomized each round.' },
    ROTATING: { id: 'ROTATING', name: 'Rotating', description: 'First player rotates clockwise each round.' },
  },
  tieRules: {
    REVOTE: { id: 'REVOTE', name: 'Revote', description: 'Trigger an immediate revote between tied candidates.' },
    NO_ELIMINATION: { id: 'NO_ELIMINATION', name: 'No Elimination', description: 'Round continues with all players surviving.' },
    RANDOM: { id: 'RANDOM', name: 'Random', description: 'Randomly eliminate one of the tied suspects.' },
    IMPOSTER_WINS: { id: 'IMPOSTER_WINS', name: 'Imposter Wins', description: 'A tie results in an immediate Imposter victory.' },
  },
  gamePresets: {
    CLASSIC: {
      id: 'CLASSIC',
      name: 'Classic Party',
      description: '1 Imposter, Category hint, Final Guess enabled.',
    },
    HARDCORE: {
      id: 'HARDCORE',
      name: 'Hardcore Bluff',
      description: '1 Imposter, No hints, Short timers, Final Guess enabled.',
    },
    CHAOS: {
      id: 'CHAOS',
      name: 'Chaos Duel',
      description: '2 Imposters, Random clue order, Anonymous voting.',
    },
    FRIENDS: {
      id: 'FRIENDS',
      name: 'Friends Fast',
      description: 'Custom word packs, Fast 20s timers, Final Guess enabled.',
    },
  },
} as const;

export type RoleId = keyof typeof APP_CONFIG.roles;
export type ImposterHintMode = keyof typeof APP_CONFIG.imposterHintModes;
export type ClueOrder = keyof typeof APP_CONFIG.clueOrders;
export type TieRule = keyof typeof APP_CONFIG.tieRules;
export type GamePresetId = keyof typeof APP_CONFIG.gamePresets;
