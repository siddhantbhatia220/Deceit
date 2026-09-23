import { PlayerRole, ImposterHintMode, PlayerSecretInfo, WordItem } from '@deceit/game-types';

export class RoleAssignmentEngine {
  /**
   * Assigns strictly CIVILIAN or IMPOSTER roles to players.
   */
  public static assignRoles(
    playerIds: string[],
    imposterCount: number
  ): Map<string, PlayerRole> {
    const assignments = new Map<string, PlayerRole>();
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);

    const actualImposters = Math.max(1, Math.min(imposterCount, Math.floor(playerIds.length / 2)));
    
    // Assign Imposters
    for (let i = 0; i < actualImposters; i++) {
      assignments.set(shuffled[i], 'IMPOSTER');
    }

    // Assign Civilians
    for (let i = actualImposters; i < shuffled.length; i++) {
      assignments.set(shuffled[i], 'CIVILIAN');
    }

    return assignments;
  }

  /**
   * Generates sanitized secret info for an individual player based on their role and host settings.
   */
  public static buildPlayerSecretInfo(
    role: PlayerRole,
    wordItem: WordItem,
    hintMode: ImposterHintMode,
    impostersKnowEachOther: boolean,
    allImposterIds: string[]
  ): PlayerSecretInfo {
    if (role === 'CIVILIAN') {
      return {
        role: 'CIVILIAN',
        secretWord: wordItem.word,
        category: wordItem.category,
      };
    }

    // Imposter info based on hint settings
    let category: string | undefined = undefined;
    let hint: string | undefined = undefined;

    if (hintMode === 'CATEGORY' || hintMode === 'CATEGORY_AND_HINT') {
      category = wordItem.category;
    }

    if (hintMode === 'CATEGORY_AND_HINT') {
      hint = wordItem.hint;
    }

    return {
      role: 'IMPOSTER',
      category,
      hint,
      knownCoImposters: impostersKnowEachOther ? allImposterIds : undefined,
    };
  }
}
