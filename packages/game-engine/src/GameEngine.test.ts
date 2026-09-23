import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from './GameEngine.js';
import { RoleAssignmentEngine } from './RoleAssignmentEngine.js';
import { VotingEngine } from './VotingEngine.js';
import { InternalPlayer } from './GameEngine.js';

test('RoleAssignmentEngine allocates exactly N imposters and all remaining civilians', () => {
  const players = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  const roles = RoleAssignmentEngine.assignRoles(players, 2);

  let imposterCount = 0;
  let civilianCount = 0;
  for (const role of roles.values()) {
    if (role === 'IMPOSTER') imposterCount++;
    if (role === 'CIVILIAN') civilianCount++;
  }
  assert.equal(imposterCount, 2);
  assert.equal(civilianCount, 4);
  assert.equal(roles.size, 6);
});

test('Voting resolution properly handles majority votes and ties', () => {
  const alivePlayers = ['p1', 'p2', 'p3'];
  const roleMap = new Map([
    ['p1', 'CIVILIAN' as const],
    ['p2', 'IMPOSTER' as const],
    ['p3', 'CIVILIAN' as const],
  ]);
  const nameMap = new Map([
    ['p1', 'Alice'],
    ['p2', 'Bob'],
    ['p3', 'Charlie'],
  ]);

  // Majority vote for p2
  const votes = [
    { voterId: 'p1', targetPlayerId: 'p2' },
    { voterId: 'p3', targetPlayerId: 'p2' },
    { voterId: 'p2', targetPlayerId: 'p1' },
  ];

  const result = VotingEngine.resolveVotes(votes, alivePlayers, roleMap, nameMap);
  assert.equal(result.eliminatedPlayerId, 'p2');
  assert.equal(result.eliminatedPlayerName, 'Bob');
  assert.equal(result.eliminatedRole, 'IMPOSTER');
  assert.equal(result.isTie, false);

  // Tie test with NO_ELIMINATION
  const tieVotes = [
    { voterId: 'p1', targetPlayerId: 'p2' },
    { voterId: 'p3', targetPlayerId: 'p1' },
  ];
  const tieResult = VotingEngine.resolveVotes(tieVotes, alivePlayers, roleMap, nameMap, 'NO_ELIMINATION');
  assert.equal(tieResult.eliminatedPlayerId, null);
  assert.equal(tieResult.isTie, true);
});

test('GameEngine secret information security: civilian receives secret word, imposter does not', () => {
  const game = new GameEngine('TEST99', { id: 'p1', name: 'Alice' }, { imposterCount: 1, imposterHintMode: 'CATEGORY' });
  game.addPlayer('p2', 'Bob');
  game.addPlayer('p3', 'Charlie');

  const started = game.startGame();
  assert.equal(started, true);

  let imposterId = '';
  let civilianId = '';
  game.players.forEach((p: InternalPlayer) => {
    if (p.role === 'IMPOSTER') imposterId = p.id;
    else civilianId = p.id;
  });

  const civilianView = game.sanitizeForPlayer(civilianId);
  assert.ok(civilianView.myInfo.secretWord, 'Civilian MUST receive secret word');
  assert.equal(civilianView.myInfo.role, 'CIVILIAN');

  const imposterView = game.sanitizeForPlayer(imposterId);
  assert.equal(imposterView.myInfo.secretWord, undefined, 'Imposter MUST NOT receive secret word');
  assert.equal(imposterView.myInfo.role, 'IMPOSTER');
  assert.ok(imposterView.myInfo.category, 'Imposter receives configured category');
});
