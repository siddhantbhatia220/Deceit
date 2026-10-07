'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Copy,
  Crown,
  Eye,
  Fingerprint,
  Gamepad2,
  Github,
  Lock,
  LogIn,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Tags,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { ClientGameState, WORD_CATEGORIES } from '@deceit/game-types';
import { APP_CONFIG } from '@deceit/config';
import { getSocket, getSocketUrl } from '@/lib/socket';
import { LocalPassAndPlay } from '@/components/game/LocalPassAndPlay';

const tabs = [
  { id: 'ONLINE', label: 'Online', icon: Wifi },
  { id: 'LOCAL', label: 'Pass & Play', icon: Smartphone },
  { id: 'RULES', label: 'How to play', icon: Sparkles },
] as const;
type Tab = (typeof tabs)[number]['id'];

export default function GamePage() {
  const [tab, setTab] = useState<Tab>('ONLINE');
  const [mobileGameEntered, setMobileGameEntered] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedWordCategories, setSelectedWordCategories] = useState([...WORD_CATEGORIES]);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [game, setGame] = useState<ClientGameState | null>(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clue, setClue] = useState('');
  const [guess, setGuess] = useState('');
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; senderName: string; text: string }>>([]);
  const [vote, setVote] = useState<string | null>(null);

  const socketReady = Boolean(getSocketUrl());

  useEffect(() => {
    if (!socketReady) return;
    const socket = getSocket();
    const onConnect = () => { setConnected(true); setError(''); };
    const onDisconnect = () => setConnected(false);
    const onState = (state: ClientGameState) => { setGame(state); setError(''); };
    const onError = (e: { message: string }) => setError(e.message);
    const onChat = (m: { id: string; senderName: string; text: string }) => {
      setMessages((prev) => [...prev.slice(-49), m]);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game:state', onState);
    socket.on('room:error', onError);
    socket.on('chat:message', onChat);
    if (socket.connected) setConnected(true);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game:state', onState);
      socket.off('room:error', onError);
      socket.off('chat:message', onChat);
    };
  }, [socketReady]);

  const onlineConfigured = socketReady;
  const networkState = onlineConfigured ? connected ? 'live' : 'linking' : tab === 'LOCAL' ? 'local' : 'missing';
  const networkLabel = onlineConfigured ? connected ? 'CONNECTED' : 'LINKING' : tab === 'LOCAL' ? 'NOT REQUIRED' : 'ADDRESS NEEDED';
  const networkDescription = onlineConfigured ? connected ? 'Multiplayer server connected' : 'Connecting to the multiplayer server' : tab === 'LOCAL' ? 'Pass and play works without an online server' : 'Add NEXT_PUBLIC_WS_URL to enable online rooms';

  const createRoom = () => {
    if (!onlineConfigured) return setError('Online play is not configured yet. Deploy the API and set NEXT_PUBLIC_WS_URL in Vercel.');
    if (!username.trim()) return setError('Choose a codename first.');
    if (selectedWordCategories.length === 0) return setError('Choose at least one word category.');
    getSocket().emit('room:create', {
      username: username.trim(),
      settings: { imposterCount: 1, imposterHintMode: 'CATEGORY', wordPackId: 'pack-movies-cinema', wordCategories: selectedWordCategories, clueOrder: 'SEQUENTIAL' },
    }, (res) => {
      if (!res.success) setError(res.error || 'Could not create room.');
    });
  };

  const joinRoom = () => {
    if (!onlineConfigured) return setError('Online play is not configured yet.');
    if (!username.trim() || !roomCode.trim()) return setError('Enter your codename and room code.');
    getSocket().emit('room:join', { username: username.trim(), roomCode: roomCode.trim().toUpperCase() }, (res) => {
      if (!res.success) setError(res.error || 'Could not join room.');
    });
  };

  const toggleWordCategory = (category: (typeof WORD_CATEGORIES)[number]) => {
    setSelectedWordCategories((selected) => selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category]);
  };

  const copyRoom = async () => {
    if (!game) return;
    try {
      await navigator.clipboard.writeText(game.roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setError('Could not copy the room code. Select and copy it manually.');
    }
  };

  if (game) return <GameRoom game={game} username={username} setUsername={setUsername} connected={connected} error={error} setError={setError} copied={copied} copyRoom={copyRoom} clue={clue} setClue={setClue} guess={guess} setGuess={setGuess} chat={chat} setChat={setChat} messages={messages} vote={vote} setVote={setVote} />;

  return (
    <main className={`app-shell ${tab === 'LOCAL' ? 'local-mode-shell' : ''} ${mobileGameEntered ? 'mobile-game-entered' : ''}`}>
      <header className="topbar">
        <a className="brand brand-home" href="/" aria-label="DECEIT home">
          <span className="brand-mark"><Fingerprint size={22} strokeWidth={1.8} /></span>
          <span>DECEIT</span>
        </a>
        <div className="topbar-center">
          <div className={`network-readout network-readout-${networkState}`} role="status" aria-live="polite" title={networkDescription}>
            <span className="network-bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="network-copy"><span>NETWORK</span><strong>{networkLabel}</strong></span>
          </div>
        </div>
        <a
          href="https://github.com/siddhantbhatia220"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label="GitHub profile"
          title="View on GitHub"
        >
          <Github size={18} />
          <span>GitHub</span>
        </a>
      </header>

      <section className={`hero ${tab === 'LOCAL' ? 'local-mode-hero' : ''}`}>
        <div className="hero-copy">
          <div className="eyebrow"><Zap size={14} /> A PASS-AROUND BLUFFING GAME</div>
          <h1>Everybody has the word.<br /><span>Except one.</span></h1>
          <p>Give one clue. Read the room. Find who is making it up.</p>
          <button className="mobile-play-cta" type="button" onClick={() => setMobileGameEntered(true)}>
            Choose a game <ArrowRight size={16} />
          </button>
        </div>

        <div className="play-card">
          <nav className="mode-tabs" aria-label="Game mode">
            {tabs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { setTab(item.id); setError(''); }} className={tab === item.id ? 'active' : ''}><Icon size={16} />{item.label}</button>; })}
          </nav>

          <AnimatePresence mode="wait">
            {tab === 'ONLINE' && (
              <motion.div key="online" className="panel-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="panel-heading"><div><div className="kicker">REMOTE ROOM</div><h2>Bring your crew in.</h2></div><div className="mini-icon"><Gamepad2 size={18} /></div></div>
                {!onlineConfigured && <div className="notice warning"><ShieldAlert size={16} /><span>Online rooms need an API address. Pass & Play works without one.</span></div>}
                {error && <div className="notice error"><ShieldAlert size={16} /><span>{error}</span></div>}
                <label className="field-label">PLAYER NAME<input value={username} onChange={(e) => setUsername(e.target.value.slice(0, 20))} placeholder="Choose your name" maxLength={20} autoComplete="nickname" /></label>
                <div className="category-picker">
                  <button className="category-picker-toggle" type="button" aria-expanded={categoryPickerOpen} onClick={() => setCategoryPickerOpen((open) => !open)}>
                    <span><Tags size={15} /> WORD POOL</span>
                    <strong>{selectedWordCategories.length} / {WORD_CATEGORIES.length}</strong>
                    <ChevronDown size={15} className={categoryPickerOpen ? 'category-picker-chevron open' : 'category-picker-chevron'} />
                  </button>
                  {categoryPickerOpen && (
                    <div className="category-picker-panel">
                      <div className="category-picker-tools">
                        <span>Choose what can be dealt.</span>
                        <button type="button" onClick={() => setSelectedWordCategories([...WORD_CATEGORIES])}>All</button>
                        <button type="button" onClick={() => setSelectedWordCategories([])}>Clear</button>
                      </div>
                      <div className="category-grid">
                        {WORD_CATEGORIES.map((category) => (
                          <label className={selectedWordCategories.includes(category) ? 'category-option selected' : 'category-option'} key={category}>
                            <input type="checkbox" checked={selectedWordCategories.includes(category)} onChange={() => toggleWordCategory(category)} />
                            <span>{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="primary-btn" onClick={createRoom} disabled={!onlineConfigured || selectedWordCategories.length === 0}><Plus size={18} /> Create online room <ArrowRight size={17} /></button>
                <div className="divider"><span>OR JOIN A ROOM</span></div>
                <div className="join-row"><input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))} placeholder="ROOM CODE" /><button className="secondary-btn" onClick={joinRoom} disabled={!onlineConfigured}><LogIn size={17} /> Join</button></div>
                <div className="feature-row"><span><Users size={14} /> 3â€“24 players</span><span><Zap size={14} /> Untimed clues</span><span><ShieldAlert size={14} /> Hidden roles</span></div>
              </motion.div>
            )}

            {tab === 'LOCAL' && (
              <motion.div key="local" className="local-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <LocalPassAndPlay />
              </motion.div>
            )}

            {tab === 'RULES' && <motion.div key="rules" className="panel-body rules" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="kicker">ROUND ORDER</div><h2>Four turns to a verdict.</h2>{[['01','Look','Take your role in private. Keep the screen turned away.'],['02','Clue','Say one thing that proves you know the word, without giving it away.'],['03','Listen','Compare the clues. Someone is working from a different story.'],['04','Vote','Choose once. The most-voted player is unmasked.']].map(([n,t,d]) => <div className="rule" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</motion.div>}
          </AnimatePresence>
        </div>
      </section>

      <footer className="footer"><span>Â© 2026 DECEIT</span><span>{APP_CONFIG.poweredBy}</span></footer>
    </main>
  );
}

function GameRoom(props: { game: ClientGameState; username: string; setUsername: (name: string) => void; connected: boolean; error: string; setError: (s: string) => void; copied: boolean; copyRoom: () => void; clue: string; setClue: (s: string) => void; guess: string; setGuess: (s: string) => void; chat: string; setChat: (s: string) => void; messages: Array<{ id: string; senderName: string; text: string }>; vote: string | null; setVote: (s: string | null) => void }) {
  const { game, username, setUsername, connected, error, setError, copied, copyRoom, clue, setClue, guess, setGuess, chat, setChat, messages, vote, setVote } = props;
  const socket = getSocket();
  const [now, setNow] = useState(Date.now());
  const [nameDraft, setNameDraft] = useState(username);
  const me = game.players.find((p) => p.name === username);
  const isTurn = game.currentTurnPlayerId === me?.id;
  const seconds = game.phaseEndTime ? Math.max(0, Math.ceil((game.phaseEndTime - now) / 1000)) : null;

  useEffect(() => {
    if (!game.phaseEndTime) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [game.phaseEndTime]);

  useEffect(() => setNameDraft(username), [username]);

  const phaseLabel = game.phase.replaceAll('_', ' ');
  const submitClue = (e: React.FormEvent) => { e.preventDefault(); if (!clue.trim()) return; socket.emit('game:clue_submit', { text: clue.trim() }); setClue(''); };
  const submitVote = () => { if (!vote) return; socket.emit('game:vote_submit', { targetPlayerId: vote }); };
  const submitGuess = (e: React.FormEvent) => { e.preventDefault(); if (!guess.trim()) return; socket.emit('game:imposter_guess', { guessedWord: guess.trim() }); setGuess(''); };
  const submitChat = (e: React.FormEvent) => { e.preventDefault(); if (!chat.trim()) return; socket.emit('chat:send', { text: chat.trim() }); setChat(''); };
  const savePlayerName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = nameDraft.trim().slice(0, 20);
    if (!name) return setError('Enter a player name.');
    socket.emit('player:update_name', { name }, (response) => {
      if (!response.success) return setError(response.error || 'Could not update your name.');
      setUsername(name);
      setError('');
    });
  };

  return <main className="room-shell">
    <header className="room-topbar">
      <a className="brand brand-home" href="/" aria-label="DECEIT home">
        <span className="brand-mark"><Fingerprint size={22} strokeWidth={1.8} /></span>
        <span>DECEIT</span>
      </a>
      <div className="room-center">
        <span className="room-code">ROOM {game.roomCode}<button onClick={copyRoom} title="Copy room code">{copied ? <Check size={14} /> : <Copy size={14} />}</button></span>
        <span className="phase-pill">{phaseLabel}</span>
        {seconds !== null && <span className="timer-pill">{seconds}s</span>}
      </div>
      <div className={`connection ${connected ? 'ok' : ''}`}>{connected ? <Wifi size={15} /> : <WifiOff size={15} />}{connected ? 'Connected' : 'Reconnecting'}</div>
    </header>
    {error && <div className="notice error room-notice"><ShieldAlert size={16} /><span>{error}</span><button onClick={() => setError('')}><X size={15} /></button></div>}
    <section className="room-grid">
      <div className="main-panel">

        {/* LOBBY */}
        {game.phase === 'LOBBY' && (
          <div className="stage">
            <div className="stage-head">
              <div><div className="kicker">ROOM LOBBY</div><h1>Build your crew.</h1><p>Share the room code, add an AI, then launch when at least three players are ready.</p></div>
              <button className="secondary-btn" onClick={() => socket.emit('player:add_bot', { personality: 'balanced' })}><Bot size={17} /> Add AI</button>
            </div>
            <form className="lobby-identity-form" onSubmit={savePlayerName}>
              <label className="field-label">YOUR PLAYER NAME<input value={nameDraft} onChange={(event) => setNameDraft(event.target.value.slice(0, 20))} maxLength={20} autoComplete="nickname" /></label>
              <button className="secondary-btn" type="submit"><Check size={15} /> Save name</button>
            </form>
            <div className="crew-grid">{game.players.map((p) => <div className="crew-card" key={p.id}><span className="avatar">{p.name.slice(0,1).toUpperCase()}</span><div><strong>{p.name}</strong><small>{p.isBot ? 'AI player' : p.isHost ? 'Host' : 'Player'} {p.isConnected ? 'â€¢ online' : 'â€¢ offline'}</small></div>{p.isHost && <Crown size={15} className="gold" />}</div>)}</div>
            <button className="primary-btn launch" disabled={game.players.length < 3} onClick={() => socket.emit('game:start')}><Gamepad2 size={18} /> Launch match</button>
          </div>
        )}

        {/* ROLE REVEAL â€” clickable card */}
        {game.phase === 'ROLE_REVEAL' && (
          <OnlineRoleReveal myInfo={game.myInfo} />
        )}

        {/* CLUE PHASE / DISCUSSION */}
        {(game.phase === 'CLUE_PHASE' || game.phase === 'DISCUSSION') && (
          <div className="stage">
            <div className="stage-head">
              <div>
                <div className="kicker">ROUND {game.currentRound} â€¢ {phaseLabel}</div>
                <h1>{game.phase === 'CLUE_PHASE' ? 'Leave your clue.' : 'Read the room.'}</h1>
                <p>{isTurn ? 'It is your turn â€” say one thing that proves you know the word.' : 'Watch what everyone says. Someone is bluffing.'}</p>
              </div>
              <div className="round-chip">{game.clues.length} clue{game.clues.length !== 1 ? 's' : ''}</div>
            </div>

            <div className="clue-feed">
              {game.clues.length ? game.clues.map((c, i) => (
                <div className="clue" key={c.id}>
                  <span className="clue-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="avatar small">{c.playerName.slice(0,1).toUpperCase()}</span>
                  <div><strong>{c.playerName}</strong><p>{c.text}</p></div>
                </div>
              )) : (
                <div className="empty-state"><MessageCircle size={22} /><span>No clues yet. Be the first.</span></div>
              )}
            </div>

            {game.phase === 'CLUE_PHASE' && (
              <form className="composer" onSubmit={submitClue}>
                <div className="composer-wrap">
                  <input
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder={isTurn ? 'One subtle clue that proves you know the wordâ€¦' : 'Waiting for your turnâ€¦'}
                    disabled={!isTurn}
                    maxLength={100}
                  />
                  {isTurn && <span className="composer-count" style={{ color: clue.length > 80 ? '#e57373' : undefined }}>{clue.length}/100</span>}
                </div>
                <button disabled={!isTurn || !clue.trim()}><Send size={17} /></button>
              </form>
            )}

            {/* After discussion â€” vote or another round */}
            {game.phase === 'DISCUSSION' && (
              <div className="discussion-actions">
                <div className="discussion-actions-label">Round {game.currentRound} complete â€” what next?</div>
                <div className="discussion-actions-row">
                  <button className="secondary-btn" onClick={() => socket.emit('game:request_more_clues')}>
                    <RefreshCw size={15} /> Another clue round
                  </button>
                  <button className="primary-btn discussion-vote-btn" onClick={() => socket.emit('game:start_voting')}>
                    <ShieldAlert size={15} /> Go to vote
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VOTING */}
        {game.phase === 'VOTING' && (
          <div className="stage">
            <div className="centered">
              <div className="eyebrow"><ShieldAlert size={14} /> FINAL CALL</div>
              <h1>Who is the imposter?</h1>
              <p>Choose carefully. Your vote can end the round.</p>
            </div>
            <div className="vote-grid">{game.players.filter((p) => p.isAlive).map((p) => <button key={p.id} className={`vote-card ${vote === p.id ? 'selected' : ''}`} onClick={() => setVote(p.id)}><span className="avatar">{p.name.slice(0,1).toUpperCase()}</span><strong>{p.name}</strong><small>{p.isBot ? 'AI player' : 'Player'}</small></button>)}</div>
            <button className="primary-btn" disabled={!vote} onClick={submitVote}><ShieldAlert size={18} /> Confirm vote</button>
          </div>
        )}

        {/* IMPOSTER GUESS */}
        {game.phase === 'IMPOSTER_GUESS' && (
          <div className="stage centered">
            <div className="eyebrow danger"><ShieldAlert size={14} /> LAST CHANCE</div>
            <h1>Steal the win.</h1>
            <p>The Imposter has been caught. Guess the secret word correctly to turn the game around.</p>
            {game.myInfo.role === 'IMPOSTER' ? (
              <form className="guess-form" onSubmit={submitGuess}>
                <input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Secret word" />
                <button className="primary-btn">Submit guess <ArrowRight size={17} /></button>
              </form>
            ) : (
              <div className="waiting"><RefreshCw size={17} /> Waiting for the Imposterâ€¦</div>
            )}
          </div>
        )}

        {/* RESULT */}
        {(game.phase === 'GAME_RESULT' || game.phase === 'ROUND_RESULT') && (
          <div className="stage centered">
            <div className="eyebrow"><Sparkles size={14} /> RESULT</div>
            <h1>{game.winnerTeam ? `${game.winnerTeam} wins.` : 'Round complete.'}</h1>
            <p>{game.winReason || 'Get ready for the next round.'}</p>
            {game.secretWordRevealed && <div className="intel-card"><small>SECRET WORD</small><strong>{game.secretWordRevealed}</strong></div>}
            {game.phase === 'GAME_RESULT' && <button className="primary-btn" onClick={() => socket.emit('game:rematch')}><RefreshCw size={18} /> Rematch</button>}
          </div>
        )}

      </div>
      <aside className="side-panel">
        <div className="side-card">
          <div className="side-title"><Users size={16} /> Players <span>{game.players.length}/{game.settings.maxPlayers}</span></div>
          <div className="side-players">{game.players.map((p) => <div className="side-player" key={p.id}><span className={`presence ${p.isConnected ? 'on' : ''}`} /><span>{p.name}</span>{p.isHost && <Crown size={12} className="gold" />}</div>)}</div>
        </div>
        <div className="side-card intel-side">
          <div className="side-title"><Eye size={16} /> {game.phase === 'LOBBY' ? 'Match status' : 'Your intel'}</div>
          {game.phase === 'LOBBY' ? (
            <><small>ROOM STATE</small><strong>Waiting to start</strong><span>Roles are assigned when the host launches the match.</span></>
          ) : (
            <><small>{game.myInfo.role === 'IMPOSTER' ? 'ROLE' : 'SECRET WORD'}</small><strong>{game.myInfo.secretWord || game.myInfo.role}</strong><span>{game.myInfo.category}</span></>
          )}
        </div>
        <div className="side-card chat-card">
          <div className="side-title"><MessageCircle size={16} /> Room chat</div>
          <div className="chat-list">{messages.length ? messages.map((m) => <div className="chat-message" key={m.id}><strong>{m.senderName}</strong><p>{m.text}</p></div>) : <div className="empty-state"><MessageCircle size={18} /> No messages yet.</div>}</div>
          <form className="composer" onSubmit={submitChat}>
            <input value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Message the roomâ€¦" maxLength={200} />
            <button><Send size={16} /></button>
          </form>
        </div>
      </aside>
    </section>
  </main>;
}

/** Online game role reveal — player must click to see their role (prevents accidental spoilers) */
function OnlineRoleReveal({ myInfo }: { myInfo: { role: string; secretWord?: string; category?: string; hint?: string } }) {
  const [revealed, setRevealed] = useState(false);
  const isImposter = myInfo.role === 'IMPOSTER';
  return (
    <div className="stage centered">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Eye size={13} /> Your Private Role
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center' as const, margin: '0 0 24px' }}>Make sure nobody else can see the screen.</p>
        <AnimatePresence mode="wait" initial={false}>
          {!revealed ? (
            <motion.button key="locked" onClick={() => setRevealed(true)} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} style={{ width: '100%', background: 'linear-gradient(145deg,rgba(22,22,26,.98),rgba(13,13,15,.98))', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '44px 28px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 20px 50px rgba(0,0,0,0.45)', position: 'relative' as const, overflow: 'hidden' }}>
              <div style={{ position: 'absolute' as const, inset: 0, borderRadius: 20, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '10px 10px', pointerEvents: 'none' as const }} />
              <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={24} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </motion.div>
              <div style={{ textAlign: 'center' as const }}>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 700, margin: '0 0 5px' }}>Tap to reveal your role</p>
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, margin: 0 }}>Ensure no one else is watching</p>
              </div>
              <motion.div animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.22)', fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
                <Eye size={10} /> Private Information
              </motion.div>
            </motion.button>
          ) : (
            <motion.div key="revealed" initial={{ opacity: 0, rotateY: 90, scale: 0.9 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }} style={{ background: isImposter ? 'linear-gradient(145deg,rgba(30,8,8,.98),rgba(20,5,5,.98))' : 'linear-gradient(145deg,rgba(18,18,18,.98),rgba(12,12,12,.98))', border: `1px solid ${isImposter ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '32px 28px', textAlign: 'center' as const, boxShadow: isImposter ? '0 24px 60px rgba(229,9,20,0.18)' : '0 24px 60px rgba(0,0,0,0.45)', position: 'relative' as const, overflow: 'hidden' }}>
              {isImposter && <div style={{ position: 'absolute' as const, inset: 0, borderRadius: 20, background: 'radial-gradient(ellipse at 50% 0%,rgba(229,9,20,0.18),transparent 65%)', pointerEvents: 'none' as const }} />}
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 18 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: isImposter ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.08)', border: `2px solid ${isImposter ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.14)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: isImposter ? '0 0 28px rgba(229,9,20,0.35)' : 'none' }}>
                  <span style={{ fontSize: 28 }}>{isImposter ? '🎭' : '🕵️'}</span>
                </div>
                <h1 style={{ fontSize: 'clamp(32px,10vw,52px)', color: isImposter ? '#E50914' : 'white', textShadow: isImposter ? '0 0 36px rgba(229,9,20,0.65)' : 'none', letterSpacing: '-0.02em', fontWeight: 900, lineHeight: 1, margin: '0 0 16px' }}>{myInfo.role}</h1>
              </motion.div>
              <div style={{ height: 1, background: isImposter ? 'linear-gradient(90deg,transparent,rgba(229,9,20,0.45),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)', margin: '0 auto 20px', width: '66%' }} />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                {myInfo.secretWord ? (
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', margin: '0 0 6px' }}>Secret Word</p>
                    <p style={{ fontSize: 'clamp(24px,7vw,36px)', letterSpacing: '0.06em', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>{myInfo.secretWord}</p>
                    <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 12 }}>Category: <span style={{ color: 'rgba(255,255,255,0.58)', fontWeight: 600 }}>{myInfo.category}</span></p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(229,9,20,0.7)', margin: '0 0 8px' }}>{myInfo.category ? 'Your Only Clue' : 'You Know Nothing'}</p>
                    {myInfo.category && <p style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 6px' }}>Category: {myInfo.category}</p>}
                    {myInfo.hint && <p style={{ color: '#f59e0b', fontSize: 12, margin: 0 }}>Hint: &ldquo;{myInfo.hint}&rdquo;</p>}
                    {!myInfo.category && <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, margin: 0 }}>Blend in. Observe carefully. Deceive everyone.</p>}
                  </div>
                )}
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 20, lineHeight: 1.5 }}>
                {isImposter ? 'Blend in with subtle clues. Deduce the secret word to win.' : 'Give clues that prove you know the word — without revealing it to the Imposter.'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        {revealed && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ textAlign: 'center' as const, color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 18 }}>Clue phase starting soon&hellip;</motion.p>}
      </motion.div>
    </div>
  );
}