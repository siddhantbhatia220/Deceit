import { PlayerRole, WordItem, ClueEntry } from '@deceit/game-types';

export class AIBotEngine {
  private static BLUFF_TEMPLATES = [
    'Subtle vibes and very recognizable.',
    'It connects directly to everyday culture.',
    'Something you definitely encounter regularly.',
    'Very distinct features and famous worldwide.',
    'Atmospheric and unforgettable impressions.',
    'Full of high energy and memorable details.',
  ];

  public static generateBotClue(
    role: PlayerRole,
    wordItem: WordItem,
    previousClues: ClueEntry[],
    personality: 'balanced' | 'aggressive' | 'quiet' | 'analytical' | 'bluffer' = 'balanced'
  ): string {
    const isCivilian = role === 'CIVILIAN';

    if (isCivilian) {
      if (wordItem.tags && wordItem.tags.length > 0 && Math.random() > 0.3) {
        const randomTag = wordItem.tags[Math.floor(Math.random() * wordItem.tags.length)];
        return `Resonates with ${randomTag}.`;
      }
      return `Key element of ${wordItem.category.toLowerCase()}.`;
    }

    // Imposter Bluff (Uses personality)
    if (personality === 'analytical' && wordItem.hint) {
      const hintWords = wordItem.hint.split(' ');
      const pick = hintWords[Math.floor(Math.random() * hintWords.length)];
      return `Reflects deeply on ${pick}.`;
    }

    if (personality === 'bluffer' && previousClues.length > 0) {
      const lastClue = previousClues[previousClues.length - 1].text;
      return `Agreed with "${lastClue.slice(0, 15)}...", very prominent.`;
    }

    const templateIndex = Math.floor(Math.random() * this.BLUFF_TEMPLATES.length);
    return this.BLUFF_TEMPLATES[templateIndex];
  }

  public static decideBotVote(
    botPlayerId: string,
    botRole: PlayerRole,
    alivePlayerIds: string[],
    clues: ClueEntry[]
  ): string | 'SKIP' {
    const otherPlayers = alivePlayerIds.filter((id) => id !== botPlayerId);
    if (otherPlayers.length === 0) return 'SKIP';

    return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
  }

  public static makeImposterGuess(wordItem: WordItem, candidateWords: string[]): string {
    if (Math.random() > 0.4) {
      return wordItem.word;
    }
    const filtered = candidateWords.filter((w) => w !== wordItem.word);
    return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : wordItem.word;
  }
}
