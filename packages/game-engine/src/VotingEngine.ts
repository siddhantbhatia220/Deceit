import { VoteRecord, VoteResult, PlayerRole, TieRule } from '@deceit/game-types';

export class VotingEngine {
  public static resolveVotes(
    votes: VoteRecord[],
    alivePlayerIds: string[],
    playerRoles: Map<string, PlayerRole>,
    playerNames: Map<string, string>,
    tieRule: TieRule = 'NO_ELIMINATION'
  ): VoteResult {
    const tallies: Record<string, number> = {};
    for (const pId of alivePlayerIds) {
      tallies[pId] = 0;
    }
    tallies['SKIP'] = 0;

    // Aggregate votes (1 vote per player)
    for (const vote of votes) {
      const target = vote.targetPlayerId;
      if (target === 'SKIP' || alivePlayerIds.includes(target)) {
        tallies[target] = (tallies[target] || 0) + 1;
      }
    }

    let maxVotes = 0;
    let candidates: string[] = [];

    for (const [target, count] of Object.entries(tallies)) {
      if (count > maxVotes) {
        maxVotes = count;
        candidates = [target];
      } else if (count === maxVotes && count > 0) {
        candidates.push(target);
      }
    }

    // No votes or skip won
    if (maxVotes === 0 || candidates[0] === 'SKIP') {
      return {
        eliminatedPlayerId: null,
        eliminatedPlayerName: null,
        eliminatedRole: null,
        isTie: false,
        tallies,
      };
    }

    // Tie between candidates
    if (candidates.length > 1) {
      if (tieRule === 'RANDOM') {
        const randomTarget = candidates[Math.floor(Math.random() * candidates.length)];
        return {
          eliminatedPlayerId: randomTarget,
          eliminatedPlayerName: playerNames.get(randomTarget) || 'Unknown Player',
          eliminatedRole: playerRoles.get(randomTarget) || null,
          isTie: true,
          tallies,
        };
      }

      // Default / NO_ELIMINATION / REVOTE
      return {
        eliminatedPlayerId: null,
        eliminatedPlayerName: null,
        eliminatedRole: null,
        isTie: true,
        tallies,
      };
    }

    const targetEliminated = candidates[0];
    return {
      eliminatedPlayerId: targetEliminated,
      eliminatedPlayerName: playerNames.get(targetEliminated) || 'Unknown Player',
      eliminatedRole: playerRoles.get(targetEliminated) || null,
      isTie: false,
      tallies,
    };
  }
}
