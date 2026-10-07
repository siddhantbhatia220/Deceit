'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Crown,
  Eye,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react';

type LocalPlayer = { id: string; name: string };
type LocalPhase = 'setup' | 'reveal' | 'clue-pass' | 'clue-turn' | 'next-round' | 'ballot-pass' | 'ballot' | 'results';
type LocalClue = { playerId: string; text: string; round: number };
type LocalVote = { voterId: string; targetId: string };
type LocalOutcome = {
  caught: boolean;
  eliminatedId: string | null;
  tally: Record<string, number>;
  awards: Record<string, number>;
};
type Scoreboard = Record<string, number>;

const SCORE_STORAGE_KEY = 'deceit-local-scores-v1';
const WORDS = [
  { word: 'INTERSTELLAR', category: 'Movies' },
  { word: 'ALGORITHM', category: 'Technology' },
  { word: 'PIZZA', category: 'Food' },
  { word: 'GUITAR', category: 'Music' },
  { word: 'VOLCANO', category: 'Nature' },
  { word: 'CHESS', category: 'Games' },
  { word: 'LIGHTHOUSE', category: 'Places' },
  { word: 'TELESCOPE', category: 'Science' },
  { word: 'SUBMARINE', category: 'Vehicles' },
];
const INITIAL_PLAYERS: LocalPlayer[] = [
  { id: 'local-alex', name: 'Alex' },
  { id: 'local-sam', name: 'Sam' },
  { id: 'local-jordan', name: 'Jordan' },
  { id: 'local-taylor', name: 'Taylor' },
];

function scoreKey(name: string): string {
  return name.trim().toLowerCase();
}

function readScores(): Scoreboard {
  try {
    const stored = localStorage.getItem(SCORE_STORAGE_KEY);
    if (!stored) return {};
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] =>
          typeof entry[0] === 'string' && typeof entry[1] === 'number' && Number.isFinite(entry[1])
      )
    );
  } catch {
    return {};
  }
}

function playerName(players: LocalPlayer[], playerId: string | null): string {
  return players.find((player) => player.id === playerId)?.name ?? 'Unknown player';
}

export function LocalPassAndPlay() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [phase, setPhase] = useState<LocalPhase>('setup');
  const [scores, setScores] = useState<Scoreboard>({});
  const [scoresLoaded, setScoresLoaded] = useState(false);
  const [notice, setNotice] = useState('');
  const [word, setWord] = useState<(typeof WORDS)[number] | null>(null);
  const [imposterId, setImposterId] = useState<string | null>(null);
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(false);
  const [clueIndex, setClueIndex] = useState(0);
  const [clueRound, setClueRound] = useState(1);
  const [clueDraft, setClueDraft] = useState('');
  const [clues, setClues] = useState<LocalClue[]>([]);
  const [voteIndex, setVoteIndex] = useState(0);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [votes, setVotes] = useState<LocalVote[]>([]);
  const [outcome, setOutcome] = useState<LocalOutcome | null>(null);
  const voteSubmissionLocked = useRef(false);
  const usedCategories = useRef(new Set<string>());

  useEffect(() => {
    setScores(readScores());
    setScoresLoaded(true);
  }, []);

  useEffect(() => {
    if (!scoresLoaded) return;
    try {
      localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scores));
    } catch {
      setNotice('This browser could not save the local score table.');
    }
  }, [scores, scoresLoaded]);

  const currentRevealPlayer = players[revealIndex];
  const currentCluePlayer = players.find((player) => player.id === turnOrder[clueIndex]);
  const currentVoter = players[voteIndex];

  const addPlayer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    if (players.some((player) => scoreKey(player.name) === scoreKey(name))) {
      setNotice('That name is already at the table.');
      return;
    }
    if (players.length >= 12) {
      setNotice('The table is full. The limit is 12 players.');
      return;
    }
    setPlayers((current) => [...current, { id: `local-${Date.now()}`, name }]);
    setNewPlayerName('');
    setNotice('');
  };

  const startRound = () => {
    if (players.length < 3) {
      setNotice('Add at least three players to start.');
      return;
    }
    const startIndex = Math.floor(Math.random() * players.length);
    setTurnOrder([...players.slice(startIndex), ...players.slice(0, startIndex)].map((player) => player.id));
    setImposterId(players[Math.floor(Math.random() * players.length)].id);
    let availableWords = WORDS.filter((candidate) => !usedCategories.current.has(candidate.category));
    if (availableWords.length === 0) {
      usedCategories.current.clear();
      availableWords = WORDS;
    }
    const nextWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedCategories.current.add(nextWord.category);
    setWord(nextWord);
    setRevealIndex(0);
    setRoleVisible(false);
    setClueIndex(0);
    setClueRound(1);
    setClueDraft('');
    setClues([]);
    setVoteIndex(0);
    setSelectedTargetId(null);
    setVotes([]);
    setOutcome(null);
    setNotice('');
    setPhase('reveal');
  };

  const continueReveal = () => {
    setRoleVisible(false);
    if (revealIndex + 1 === players.length) {
      setClueIndex(0);
      setPhase('clue-pass');
    } else {
      setRevealIndex((current) => current + 1);
    }
  };

  const submitClue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = clueDraft.trim();
    if (!text || !currentCluePlayer) return;
    setClues((current) => [...current, { playerId: currentCluePlayer.id, text, round: clueRound }]);
    setClueDraft('');
    if (clueIndex + 1 === players.length) {
      setPhase('next-round');
    } else {
      setClueIndex((current) => current + 1);
      setPhase('clue-pass');
    }
  };

  const startNextClueRound = () => {
    setTurnOrder((current) => current.length > 1 ? [...current.slice(1), current[0]] : current);
    setClueIndex(0);
    setClueRound((current) => current + 1);
    setPhase('clue-pass');
  };

  const beginVote = () => {
    setVoteIndex(0);
    setSelectedTargetId(null);
    setPhase('ballot-pass');
  };

  const submitVote = () => {
    if (voteSubmissionLocked.current || !selectedTargetId || !currentVoter || !imposterId) return;
    voteSubmissionLocked.current = true;
    const completedVotes = [...votes, { voterId: currentVoter.id, targetId: selectedTargetId }];
    setVotes(completedVotes);
    setSelectedTargetId(null);

    if (voteIndex + 1 < players.length) {
      setVoteIndex((current) => current + 1);
      setPhase('ballot-pass');
      return;
    }

    const tally = completedVotes.reduce<Record<string, number>>((result, ballot) => {
      result[ballot.targetId] = (result[ballot.targetId] ?? 0) + 1;
      return result;
    }, {});
    const highestVotes = Math.max(...Object.values(tally));
    const leaders = Object.entries(tally).filter(([, count]) => count === highestVotes);
    const eliminatedId = leaders.length === 1 ? leaders[0][0] : null;
    const caught = eliminatedId === imposterId;
    const awards: Record<string, number> = {};

    if (caught) {
      completedVotes.forEach((ballot) => {
        if (ballot.targetId === imposterId) awards[ballot.voterId] = 1;
      });
    } else {
      awards[imposterId] = 2;
    }

    setOutcome({ caught, eliminatedId, tally, awards });
    setScores((current) => {
      const updated = { ...current };
      Object.entries(awards).forEach(([playerId, points]) => {
        const player = players.find((candidate) => candidate.id === playerId);
        if (player) updated[scoreKey(player.name)] = (updated[scoreKey(player.name)] ?? 0) + points;
      });
      return updated;
    });
    setPhase('results');
  };

  const clearRound = () => {
    usedCategories.current.clear();
    setWord(null);
    setImposterId(null);
    setTurnOrder([]);
    setRevealIndex(0);
    setRoleVisible(false);
    setClueIndex(0);
    setClueRound(1);
    setClueDraft('');
    setClues([]);
    setVoteIndex(0);
    setSelectedTargetId(null);
    setVotes([]);
    setOutcome(null);
    setNotice('');
    setPhase('setup');
  };

  const clearScores = () => {
    setScores({});
    try {
      localStorage.removeItem(SCORE_STORAGE_KEY);
    } catch {
      setNotice('This browser could not clear the local score table.');
    }
  };

  const activePlayerId = phase === 'reveal'
    ? currentRevealPlayer?.id
    : phase.startsWith('clue-') || phase === 'next-round'
      ? currentCluePlayer?.id
      : currentVoter?.id;
  const activePlayer = players.find((player) => player.id === activePlayerId);

  return (
    <div className="local-game">
      <div className="local-game-head">
        <div>
          <div className="local-kicker"><Smartphone size={13} /> PASS THE DEVICE / KEEP ROLES HIDDEN</div>
          <h2>{phase === 'setup' ? 'Build your lineup.' : phase === 'results' ? 'The votes are in.' : phase === 'next-round' ? 'Keep the clues coming?' : 'A secret is waiting.'}</h2>
        </div>
      </div>

      {notice && <div className="local-notice" role="status">{notice}</div>}

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={`${phase}-${activePlayerId ?? 'setup'}-${roleVisible ? 'open' : 'closed'}`}
          className="local-phase"
          initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {phase === 'setup' && (
            <>
              <div className="local-section-intro">
                <span className="local-step">01 / CREW</span>
                <p>Add 3 to 12 people. Pass the device between turns so each role stays private.</p>
              </div>
              <form className="local-add-player" onSubmit={addPlayer}>
                <input
                  aria-label="Player name"
                  value={newPlayerName}
                  onChange={(event) => setNewPlayerName(event.target.value)}
                  placeholder="Add a player"
                  maxLength={20}
                />
                <button className="secondary-btn square" aria-label="Add player" type="submit"><Plus size={18} /></button>
              </form>
              <div className="local-roster-head"><span><Users size={14} /> THE LINEUP</span><span>{players.length}/12</span></div>
              <div className="local-roster">
                {players.map((player, index) => (
                  <motion.div className="local-player-row" key={player.id} layout initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="local-player-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="avatar">{player.name.slice(0, 1).toUpperCase()}</span>
                    <strong>{player.name}</strong>
                    {index === 0 && <Crown size={13} className="gold" />}
                    <span className="local-player-score"><Trophy size={12} />{scores[scoreKey(player.name)] ?? 0}</span>
                    <button type="button" aria-label={`Remove ${player.name}`} onClick={() => setPlayers((current) => current.filter((candidate) => candidate.id !== player.id))}><X size={14} /></button>
                  </motion.div>
                ))}
              </div>
              <div className="local-score-note"><span>MATCH RECORD</span><button type="button" onClick={clearScores}>Clear points</button></div>
              <button className="primary-btn local-launch" onClick={startRound} disabled={players.length < 3}>
                <Sparkles size={17} /> Start game <ArrowRight size={17} />
              </button>
              <p className="local-storage-note">Scores stay on this device. An unfinished round is erased when you leave this mode.</p>
            </>
          )}

          {phase === 'reveal' && currentRevealPlayer && (
            <div className="local-private-stage">
              <div className="local-stage-meta"><span className="local-step">02 / PRIVATE ROLE</span><span>{revealIndex + 1} OF {players.length}</span></div>
              <div className="local-passport"><span className="avatar">{currentRevealPlayer.name.slice(0, 1).toUpperCase()}</span><strong>Pass the device to {currentRevealPlayer.name}</strong><span>Make sure nobody else can see the screen.</span></div>
              {!roleVisible ? (
                <button className="primary-btn" onClick={() => setRoleVisible(true)}><Eye size={17} /> Reveal my role</button>
              ) : (
                <motion.div className={`local-secret ${currentRevealPlayer.id === imposterId ? 'is-imposter' : ''}`} initial={{ opacity: 0, rotateX: -18, scale: .94 }} animate={{ opacity: 1, rotateX: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>
                  <div className="local-secret-mark"><ShieldAlert size={15} /> PRIVATE INFORMATION</div>
                  <span>{currentRevealPlayer.id === imposterId ? 'YOU ARE THE' : 'YOUR SECRET WORD'}</span>
                  <strong>{currentRevealPlayer.id === imposterId ? 'IMPOSTER' : word?.word}</strong>
                  <small>{currentRevealPlayer.id === imposterId ? `Blend in. Category: ${word?.category}` : `Category: ${word?.category}`}</small>
                  <button className="secondary-btn" onClick={continueReveal}><Check size={16} /> Hide and pass on</button>
                </motion.div>
              )}
            </div>
          )}

          {phase === 'clue-pass' && currentCluePlayer && (
            <div className="local-private-stage">
              <div className="local-stage-meta"><span className="local-step">03 / CLUE ROUND {clueRound}</span><span>{clueIndex + 1} OF {players.length}</span></div>
              <div className="local-passport"><span className="avatar">{currentCluePlayer.name.slice(0, 1).toUpperCase()}</span><strong>Pass the device to {currentCluePlayer.name}</strong><span>{clueIndex === 0 ? 'You were picked to open the discussion.' : 'Your clue is next. Keep the word secret.'}</span></div>
              <button className="primary-btn" onClick={() => setPhase('clue-turn')}><MessageIcon /> Give clue <ArrowRight size={17} /></button>
            </div>
          )}

          {phase === 'clue-turn' && currentCluePlayer && (
            <div className="local-private-stage">
              <div className="local-stage-meta"><span className="local-step">03 / CLUE ROUND {clueRound}</span><span>{clueIndex + 1} OF {players.length}</span></div>
              <h3 className="local-turn-title">{currentCluePlayer.name}, leave a clue.</h3>
              <p className="local-turn-copy">Civilians know the word. The imposter is listening for a way in. No timer; one clue each.</p>
              <div className="local-clue-feed">
                {clues.length ? clues.map((clue, index) => (
                  <motion.div key={`${clue.playerId}-${index}`} className="local-clue-row" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                    <span>R{clue.round}</span><strong>{playerName(players, clue.playerId)}</strong><p>{clue.text}</p>
                  </motion.div>
                )) : <div className="local-clue-empty">The table is quiet. Break it.</div>}
              </div>
              <form className="local-clue-form" onSubmit={submitClue}>
                <input aria-label="Your clue" value={clueDraft} onChange={(event) => setClueDraft(event.target.value)} placeholder="Write one subtle clue" maxLength={100} />
                <button className="primary-btn" type="submit" disabled={!clueDraft.trim()}><Send size={16} /> Lock clue</button>
              </form>
            </div>
          )}

          {phase === 'next-round' && (
            <div className="local-private-stage">
              <div className="local-stage-meta"><span className="local-step">03 / ROUND {clueRound} COMPLETE</span><span>{clues.length} CLUES</span></div>
              <h3 className="local-turn-title">Another clue round?</h3>
              <p className="local-turn-copy">Keep circling the word, or lock in your suspicions and vote.</p>
              <div className="local-clue-feed">
                {clues.map((clue, index) => (
                  <motion.div key={`${clue.playerId}-${clue.round}`} className="local-clue-row" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                    <span>R{clue.round}</span><strong>{playerName(players, clue.playerId)}</strong><p>{clue.text}</p>
                  </motion.div>
                ))}
              </div>
              <div className="local-round-actions">
                <button className="secondary-btn" onClick={beginVote}><ShieldAlert size={15} /> No, start the vote</button>
                <button className="primary-btn" onClick={startNextClueRound}><RefreshCw size={15} /> Yes, another round</button>
              </div>
            </div>
          )}

          {phase === 'ballot-pass' && currentVoter && (
            <div className="local-private-stage">
              <div className="local-stage-meta"><span className="local-step">04 / PRIVATE BALLOT</span><span>{voteIndex + 1} OF {players.length}</span></div>
              <div className="local-passport"><span className="avatar">{currentVoter.name.slice(0, 1).toUpperCase()}</span><strong>Pass the device to {currentVoter.name}</strong><span>Each player gets one locked vote. Previous ballots stay hidden.</span></div>
              <button className="primary-btn" onClick={() => { voteSubmissionLocked.current = false; setPhase('ballot'); }}><ShieldAlert size={17} /> Open private ballot</button>
            </div>
          )}

          {phase === 'ballot' && currentVoter && (
            <div className="local-private-stage">
              <div className="local-stage-meta"><span className="local-step">04 / PRIVATE BALLOT</span><span>{voteIndex + 1} OF {players.length}</span></div>
              <h3 className="local-turn-title">{currentVoter.name}, choose one.</h3>
              <p className="local-turn-copy">Your selection is locked when submitted. No second vote.</p>
              <div className="local-candidate-list">
                {players.map((player) => (
                  <button type="button" key={player.id} aria-pressed={selectedTargetId === player.id} className={selectedTargetId === player.id ? 'selected' : ''} onClick={() => setSelectedTargetId(player.id)}>
                    <span className="avatar">{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong><span>{selectedTargetId === player.id ? <Check size={16} /> : 'SELECT'}</span>
                  </button>
                ))}
              </div>
              <button className="primary-btn" onClick={submitVote} disabled={!selectedTargetId}><ShieldAlert size={17} /> Lock my vote</button>
            </div>
          )}

          {phase === 'results' && outcome && (
            <div className="local-result-stage">
              <div className="local-stage-meta"><span className="local-step">05 / ROUND REPORT</span><span>ALL VOTES LOCKED</span></div>
              <motion.div className={`local-result-banner ${outcome.caught ? 'caught' : ''}`} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
                <Trophy size={22} />
                <h3>{outcome.caught ? 'The table saw through it.' : 'The imposter slipped away.'}</h3>
                <p>{outcome.caught ? 'Every player who voted for the imposter earns 1 point.' : 'The imposter earns 2 points for surviving the vote.'}</p>
              </motion.div>
              <div className="local-reveal-result"><span>THE IMPOSTER</span><strong>{playerName(players, imposterId)}</strong><small>The word was {word?.word} ({word?.category}).</small></div>
              <div className="local-result-list">
                {players.map((player) => (
                  <div key={player.id}>
                    <span>{player.name}{player.id === outcome.eliminatedId ? ' / MOST VOTED' : ''}</span>
                    <strong>{outcome.tally[player.id] ?? 0} {outcome.tally[player.id] === 1 ? 'VOTE' : 'VOTES'}{outcome.awards[player.id] ? `  +${outcome.awards[player.id]} PT` : ''}</strong>
                  </div>
                ))}
              </div>
              <div className="local-round-actions">
                <button className="secondary-btn" onClick={clearRound}><RefreshCw size={16} /> Back to table</button>
                <button className="primary-btn" onClick={startRound}><Sparkles size={16} /> Play again</button>
              </div>
              <p className="local-storage-note">Only scores are saved on this device. Secret roles, words, clues, and ballots are not cached.</p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

function MessageIcon() {
  return <Sparkles size={17} />;
}
