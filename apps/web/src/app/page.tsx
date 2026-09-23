'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '@/lib/socket';
import { ClientGameState, GameSettings } from '@deceit/game-types';
import { APP_CONFIG } from '@deceit/config';
import { 
  Users, 
  Play, 
  PlusCircle, 
  LogIn, 
  Sparkles, 
  ShieldAlert, 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  RotateCcw,
  Eye,
  Crown,
  BookOpen,
  Settings as SettingsIcon,
  Skull,
  HelpCircle,
  Layers,
  Smartphone,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function GamePage() {
  const [username, setUsername] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [gameState, setGameState] = useState<ClientGameState | null>(null);
  const [clueInput, setClueInput] = useState('');
  const [imposterGuessInput, setImposterGuessInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; senderName: string; text: string; channel: string }>>([]);
  const [activeTab, setActiveTab] = useState<'PLAY' | 'PRESETS' | 'WORD_PACKS' | 'RULES' | 'LOCAL'>('PLAY');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<string | 'SKIP' | null>(null);

  // Local Pass & Play State
  const [localPlayers, setLocalPlayers] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'David']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [localGameRunning, setLocalGameRunning] = useState(false);
  const [localCurrentPlayerIndex, setLocalCurrentPlayerIndex] = useState(0);
  const [localCardRevealed, setLocalCardRevealed] = useState(false);
  const [localImposterIndex, setLocalImposterIndex] = useState<number>(0);
  const [localWord, setLocalWord] = useState({ word: 'INTERSTELLAR', category: 'Movies', hint: 'Space time dilation' });

  // Custom Settings State for Room Creation
  const [settingsImposters, setSettingsImposters] = useState(1);
  const [settingsHintMode, setSettingsHintMode] = useState<'NONE' | 'CATEGORY' | 'CATEGORY_AND_HINT'>('CATEGORY');
  const [settingsPack, setSettingsPack] = useState('pack-movies-cinema');
  const [settingsClueOrder, setSettingsClueOrder] = useState<'SEQUENTIAL' | 'RANDOM' | 'ROTATING'>('SEQUENTIAL');

  useEffect(() => {
    const socket = getSocket();

    socket.on('game:state', (state: ClientGameState) => {
      setGameState(state);
      setErrorMsg(null);
    });

    socket.on('chat:message', (msg) => {
      setChatMessages((prev) => [...prev.slice(-40), msg]);
    });

    socket.on('room:error', (err) => {
      setErrorMsg(err.message);
    });

    return () => {
      socket.off('game:state');
      socket.off('chat:message');
      socket.off('room:error');
    };
  }, []);

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    const socket = getSocket();
    socket.emit('room:create', { 
      username: username.trim(),
      settings: {
        imposterCount: settingsImposters,
        imposterHintMode: settingsHintMode,
        wordPackId: settingsPack,
        clueOrder: settingsClueOrder,
      }
    }, (res) => {
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create room');
      }
    });
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomCodeInput.trim()) {
      setErrorMsg('Please enter both your name and room code');
      return;
    }
    const socket = getSocket();
    socket.emit('room:join', { roomCode: roomCodeInput.trim(), username: username.trim() }, (res) => {
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to join room');
      }
    });
  };

  const handleStartGame = () => {
    getSocket().emit('game:start');
  };

  const handleAddBot = (personality: 'balanced' | 'aggressive' | 'quiet' | 'analytical' | 'bluffer' = 'balanced') => {
    getSocket().emit('player:add_bot', { personality });
  };

  const handleRemoveBot = (botId: string) => {
    getSocket().emit('player:remove_bot', { botId });
  };

  const handleSubmitClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueInput.trim()) return;
    getSocket().emit('game:clue_submit', { text: clueInput.trim() });
    setClueInput('');
  };

  const handleSubmitVote = () => {
    if (!selectedVoteId) return;
    getSocket().emit('game:vote_submit', { targetPlayerId: selectedVoteId });
  };

  const handleSubmitImposterGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imposterGuessInput.trim()) return;
    getSocket().emit('game:imposter_guess', { guessedWord: imposterGuessInput.trim() });
    setImposterGuessInput('');
  };

  const handleRematch = () => {
    getSocket().emit('game:rematch');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    getSocket().emit('chat:send', { text: chatInput.trim() });
    setChatInput('');
  };

  // Local Pass & Play Controls
  const startLocalGame = () => {
    if (localPlayers.length < 3) {
      setErrorMsg('At least 3 players required for Local Pass & Play.');
      return;
    }
    const randomImp = Math.floor(Math.random() * localPlayers.length);
    setLocalImposterIndex(randomImp);
    setLocalCurrentPlayerIndex(0);
    setLocalCardRevealed(false);
    setLocalGameRunning(true);
  };

  const addLocalPlayer = () => {
    if (!newPlayerName.trim()) return;
    setLocalPlayers([...localPlayers, newPlayerName.trim()]);
    setNewPlayerName('');
  };

  // -------------------------------------------------------------
  // VIEW: LANDING & ROOM SELECTION
  // -------------------------------------------------------------
  if (!gameState) {
    return (
      <div className="flex flex-col min-h-screen justify-between px-4 py-8 max-w-5xl mx-auto w-full">
        {/* HEADER BRAND */}
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center font-display font-black text-xl text-white shadow-lg shadow-red-600/30">
              D
            </div>
            <span className="text-2xl font-black font-display tracking-tight text-white">DECEIT</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-brand-bright animate-pulse" />
            <span>Secret-Word Imposter Game</span>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="my-auto py-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tight text-gradient-red mb-3">
              WHO'S HIDING THE WORD?
            </h1>
            <p className="text-lg sm:text-xl text-text-muted font-light">
              One secret word. One imposter. Everyone is watching.
            </p>
          </div>

          {/* MAIN TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('PLAY')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'PLAY' ? 'bg-brand-red text-white shadow-lg shadow-red-600/30' : 'bg-surface text-text-muted hover:text-white border border-white/5'
              }`}
            >
              Online Game
            </button>
            <button
              onClick={() => setActiveTab('LOCAL')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${
                activeTab === 'LOCAL' ? 'bg-brand-red text-white shadow-lg shadow-red-600/30' : 'bg-surface text-text-muted hover:text-white border border-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Pass & Play (Local)
            </button>
            <button
              onClick={() => setActiveTab('PRESETS')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'PRESETS' ? 'bg-brand-red text-white shadow-lg shadow-red-600/30' : 'bg-surface text-text-muted hover:text-white border border-white/5'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab('RULES')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'RULES' ? 'bg-brand-red text-white shadow-lg shadow-red-600/30' : 'bg-surface text-text-muted hover:text-white border border-white/5'
              }`}
            >
              How It Works
            </button>
          </div>

          {errorMsg && (
            <div className="max-w-md mx-auto mb-4 px-4 py-2.5 bg-brand-dark border border-brand-red/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-bright flex-shrink-0" /> {errorMsg}
            </div>
          )}

          {/* TAB 1: ONLINE PLAY */}
          {activeTab === 'PLAY' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto glass-panel p-6 rounded-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Your Codename
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-red font-medium text-sm"
                  />
                </div>

                {/* Host Game Settings Accordion */}
                <div className="p-3 bg-surface rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase">
                    <span>Host Quick Rules</span>
                    <span className="text-[10px] text-brand-bright">Customizable</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-text-muted block mb-1">Imposters:</span>
                      <select
                        value={settingsImposters}
                        onChange={(e) => setSettingsImposters(Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-card border border-white/10 rounded-lg text-white font-medium"
                      >
                        <option value={1}>1 Imposter</option>
                        <option value={2}>2 Imposters</option>
                        <option value={3}>3 Imposters</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-text-muted block mb-1">Imposter Hint:</span>
                      <select
                        value={settingsHintMode}
                        onChange={(e) => setSettingsHintMode(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-card border border-white/10 rounded-lg text-white font-medium"
                      >
                        <option value="NONE">No Hint</option>
                        <option value="CATEGORY">Category Only</option>
                        <option value="CATEGORY_AND_HINT">Category + Hint</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button
                    onClick={handleCreateRoom}
                    className="w-full py-3.5 bg-brand-red hover:bg-brand-bright text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" /> Create Room
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-text-muted tracking-widest">Or Join Code</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ROOM CODE"
                      maxLength={8}
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                      className="w-2/3 px-4 py-3 bg-card border border-white/10 rounded-xl text-white uppercase tracking-widest placeholder-neutral-600 focus:outline-none focus:border-brand-red font-mono font-bold text-center text-sm"
                    />
                    <button
                      onClick={handleJoinRoom}
                      className="w-1/3 py-3 bg-surface hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <LogIn className="w-4 h-4" /> Join
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LOCAL PASS & PLAY */}
          {activeTab === 'LOCAL' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto glass-panel p-6 rounded-2xl">
              {!localGameRunning ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-brand-bright" /> Pass the Phone Setup
                    </h3>
                    <span className="text-xs text-text-muted">{localPlayers.length} Friends</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add player name..."
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-card border border-white/10 rounded-xl text-white text-sm"
                    />
                    <button
                      onClick={addLocalPlayer}
                      className="px-4 py-2 bg-surface hover:bg-white/10 border border-white/10 font-bold text-xs rounded-xl"
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {localPlayers.map((name, i) => (
                      <div key={i} className="p-2.5 bg-card rounded-lg border border-white/5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{name}</span>
                        <button
                          onClick={() => setLocalPlayers(localPlayers.filter((_, idx) => idx !== i))}
                          className="text-text-muted hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={startLocalGame}
                    className="w-full py-3.5 bg-brand-red hover:bg-brand-bright text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all"
                  >
                    Start Local Match
                  </button>
                </div>
              ) : (
                /* Pass & Play Reveal Screen */
                <div className="text-center py-4 space-y-6">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    Player {localCurrentPlayerIndex + 1} of {localPlayers.length}
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    {localPlayers[localCurrentPlayerIndex]}
                  </h3>

                  {!localCardRevealed ? (
                    <div className="py-8">
                      <p className="text-xs text-text-muted mb-4">Pass device to {localPlayers[localCurrentPlayerIndex]} and tap below to reveal role.</p>
                      <button
                        onClick={() => setLocalCardRevealed(true)}
                        className="px-8 py-4 bg-brand-red text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/40"
                      >
                        Tap to View Secret Word
                      </button>
                    </div>
                  ) : (
                    <div className="glass-panel-red p-6 rounded-2xl max-w-sm mx-auto space-y-3">
                      {localCurrentPlayerIndex === localImposterIndex ? (
                        <>
                          <span className="text-xs font-extrabold text-brand-bright uppercase tracking-widest">You are the</span>
                          <h4 className="text-3xl font-black text-brand-bright">IMPOSTER</h4>
                          <p className="text-xs text-text-muted">You do NOT know the secret word. Blend in with clever clues!</p>
                          <p className="text-xs text-amber-300 font-bold mt-2">Category: {localWord.category}</p>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-extrabold text-text-muted uppercase tracking-widest">Your Secret Word</span>
                          <h4 className="text-3xl font-black text-white font-mono tracking-wider">{localWord.word}</h4>
                          <p className="text-xs text-text-muted">Category: {localWord.category}</p>
                        </>
                      )}

                      <div className="pt-4 border-t border-white/10">
                        <button
                          onClick={() => {
                            if (localCurrentPlayerIndex + 1 < localPlayers.length) {
                              setLocalCurrentPlayerIndex(localCurrentPlayerIndex + 1);
                              setLocalCardRevealed(false);
                            } else {
                              setLocalGameRunning(false);
                            }
                          }}
                          className="w-full py-3 bg-white text-black font-extrabold text-xs rounded-xl"
                        >
                          {localCurrentPlayerIndex + 1 < localPlayers.length ? 'Hide & Pass to Next Player' : 'All Roles Seen! Start Clues'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PRESETS */}
          {activeTab === 'PRESETS' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(APP_CONFIG.gamePresets).map((preset) => (
                <div key={preset.id} className="glass-panel p-4 rounded-xl border border-white/5 space-y-1.5">
                  <h4 className="font-bold text-sm text-white">{preset.name}</h4>
                  <p className="text-xs text-text-muted">{preset.description}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 4: HOW IT WORKS */}
          {activeTab === 'RULES' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto glass-panel p-6 rounded-2xl text-xs space-y-3 text-text-muted leading-relaxed">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">The 30-Second Rulebook:</h3>
              <p>1. <strong className="text-white">Secret Word:</strong> Civilians receive one secret word. The Imposter receives no word (only category info).</p>
              <p>2. <strong className="text-white">Clue Phase:</strong> Everyone gives a short 1-word or 1-sentence clue proving they know the word without giving it away to the Imposter.</p>
              <p>3. <strong className="text-white">Discuss & Vote:</strong> Scrutinize clues, debate suspicion, and vote to eliminate the Imposter.</p>
              <p>4. <strong className="text-white">Imposter Steal:</strong> If caught, the Imposter gets one last guess at the secret word to steal the win!</p>
            </motion.div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
          <span>© 2026 DECEIT</span>
          <span className="font-semibold text-neutral-400">{APP_CONFIG.poweredBy}</span>
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: ONLINE ROOM & GAMEPLAY
  // -------------------------------------------------------------
  const mySecret = gameState.myInfo;
  const isMyTurn = gameState.currentTurnPlayerId === gameState.players.find(p => p.name === username)?.id;

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* HEADER */}
      <header className="flex items-center justify-between glass-panel px-5 py-3 rounded-2xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-brand-red flex items-center justify-center font-display font-black text-sm text-white">
            D
          </div>
          <span className="text-lg font-black font-display text-white">DECEIT</span>
          <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-md border border-white/10 text-xs font-mono font-bold text-brand-bright">
            {gameState.roomCode}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase px-2.5 py-1 bg-brand-dark border border-brand-red/40 text-red-300 rounded-full font-bold">
            {gameState.phase.replace('_', ' ')}
          </span>
          {gameState.phaseDurationSeconds > 0 && gameState.phaseEndTime && (
            <span className="font-mono text-xs px-2 py-1 bg-card rounded border border-white/10 text-amber-400 font-bold">
              ⏱ {Math.max(0, Math.floor((gameState.phaseEndTime - Date.now()) / 1000))}s
            </span>
          )}
        </div>
      </header>

      {errorMsg && (
        <div className="mb-4 px-4 py-2.5 bg-brand-dark border border-brand-red/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-bright flex-shrink-0" /> {errorMsg}
        </div>
      )}

      {/* MAIN GAMEPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* LEFT / CENTER INTERACTION AREA */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          {/* LOBBY PHASE */}
          {gameState.phase === 'LOBBY' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-bright" /> Room Players ({gameState.players.length}/{gameState.settings.maxPlayers})
                  </h3>
                  <button
                    onClick={() => handleAddBot('balanced')}
                    className="px-3 py-1.5 bg-card hover:bg-white/10 text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-neutral-400" /> + Add AI Player
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                  {gameState.players.map((p) => (
                    <div key={p.id} className="bg-card p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">{p.name} {p.isHost && '👑'}</span>
                        <span className="text-[10px] text-text-muted">{p.isBot ? 'AI Bot' : 'Player'}</span>
                      </div>
                      {p.isBot && (
                        <button onClick={() => handleRemoveBot(p.id)} className="text-neutral-500 hover:text-red-400 p-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-text-muted">Min 3 players required to start.</span>
                <button
                  onClick={handleStartGame}
                  disabled={gameState.players.length < 3}
                  className="w-full sm:w-auto px-8 py-3 bg-brand-red hover:bg-brand-bright disabled:opacity-40 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Launch Match
                </button>
              </div>
            </motion.div>
          )}

          {/* ROLE REVEAL PHASE */}
          {gameState.phase === 'ROLE_REVEAL' && (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-panel-red p-8 rounded-2xl text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-text-muted">
                Your Secret Role
              </span>
              <h3 className={`text-4xl sm:text-5xl font-black ${mySecret.role === 'IMPOSTER' ? 'text-brand-bright' : 'text-white'}`}>
                {mySecret.role}
              </h3>
              <p className="text-xs text-text-muted max-w-md">
                {mySecret.role === 'IMPOSTER'
                  ? "You DO NOT know the secret word. Blend in with clever clues and deduce what everyone is talking about!"
                  : "You know the secret word. Give subtle clues to identify other innocents without revealing the word."}
              </p>

              <div className="bg-card px-6 py-4 rounded-xl border border-white/10 mt-2 max-w-xs w-full">
                {mySecret.secretWord ? (
                  <>
                    <span className="text-[10px] uppercase text-text-muted font-bold block mb-1">Secret Word:</span>
                    <span className="text-2xl font-black text-white font-mono tracking-wider">{mySecret.secretWord}</span>
                    <span className="text-[10px] text-text-muted block mt-1">Category: {mySecret.category}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase text-brand-bright font-bold block mb-1">Category:</span>
                    <span className="text-xl font-bold text-white">{mySecret.category || 'Unknown'}</span>
                    {mySecret.hint && <span className="text-[11px] text-amber-300 block mt-1">Hint: {mySecret.hint}</span>}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* CLUE PHASE & DISCUSSION */}
          {(gameState.phase === 'CLUE_PHASE' || gameState.phase === 'DISCUSSION') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5 rounded-2xl flex-1 flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {gameState.phase === 'CLUE_PHASE' ? `Clue Phase (Round ${gameState.currentRound})` : 'Open Discussion'}
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    {gameState.phase === 'CLUE_PHASE' ? 'Players take turns providing subtle clues.' : 'Analyze the clues and deduce who was bluffing!'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-text-muted uppercase block">Category</span>
                  <span className="text-xs font-bold text-white">{mySecret.category || 'General'}</span>
                </div>
              </div>

              {/* Clues Feed */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[260px] pr-1">
                {gameState.clues.length === 0 ? (
                  <p className="text-xs text-neutral-600 italic text-center py-6">Awaiting first clue...</p>
                ) : (
                  gameState.clues.map((c) => (
                    <div key={c.id} className="bg-card p-2.5 rounded-xl border border-white/5 text-xs">
                      <span className="font-bold text-brand-bright mr-1.5">{c.playerName}:</span>
                      <span className="text-white font-medium">"{c.text}"</span>
                    </div>
                  ))
                )}
              </div>

              {/* Clue Input Form */}
              {gameState.phase === 'CLUE_PHASE' && (
                <form onSubmit={handleSubmitClue} className="flex gap-2 pt-2 border-t border-white/10">
                  <input
                    type="text"
                    placeholder="Enter your subtle clue..."
                    value={clueInput}
                    onChange={(e) => setClueInput(e.target.value)}
                    maxLength={100}
                    className="flex-1 px-3 py-2 bg-card border border-white/10 rounded-xl text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-brand-red"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-red hover:bg-brand-bright text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all"
                  >
                    Submit Clue
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* VOTING PHASE */}
          {gameState.phase === 'VOTING' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-2xl flex-1 flex flex-col space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-black text-brand-bright">WHO IS THE IMPOSTER?</h3>
                <p className="text-xs text-text-muted mt-1">Select the player you suspect does not know the secret word.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
                {gameState.players
                  .filter((p) => p.isAlive)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedVoteId(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedVoteId === p.id
                          ? 'bg-brand-dark border-brand-red ring-2 ring-brand-red/50'
                          : 'bg-card border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold text-xs text-white block">{p.name}</span>
                      <span className="text-[10px] text-text-muted">{p.isBot ? 'AI Player' : 'Player'}</span>
                    </button>
                  ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => setSelectedVoteId('SKIP')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                    selectedVoteId === 'SKIP' ? 'bg-amber-950/60 border-amber-500 text-amber-300' : 'bg-surface border-white/10 text-text-muted'
                  }`}
                >
                  Skip Vote
                </button>
                <button
                  onClick={handleSubmitVote}
                  disabled={!selectedVoteId}
                  className="flex-1 py-2.5 bg-brand-red hover:bg-brand-bright disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all"
                >
                  Confirm Vote
                </button>
              </div>
            </motion.div>
          )}

          {/* FINAL IMPOSTER GUESS */}
          {gameState.phase === 'IMPOSTER_GUESS' && (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-panel-red p-8 rounded-2xl text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-bright">
                Final Deception Chance
              </span>
              <h3 className="text-3xl font-black text-white">IMPOSTER'S FINAL GUESS</h3>
              <p className="text-xs text-text-muted max-w-sm">
                The Imposter was caught! If they can guess the secret word right now, they steal victory!
              </p>

              {mySecret.role === 'IMPOSTER' ? (
                <form onSubmit={handleSubmitImposterGuess} className="w-full max-w-xs space-y-2.5 mt-2">
                  <input
                    type="text"
                    placeholder="Type secret word..."
                    value={imposterGuessInput}
                    onChange={(e) => setImposterGuessInput(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-brand-red/50 rounded-xl text-white font-mono font-bold text-center uppercase tracking-wider text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-red hover:bg-brand-bright text-white font-bold rounded-xl shadow-lg shadow-red-600/30 text-xs"
                  >
                    Submit Guess
                  </button>
                </form>
              ) : (
                <p className="text-xs text-neutral-500 animate-pulse pt-2">Awaiting Imposter's final guess...</p>
              )}
            </motion.div>
          )}

          {/* GAME RESULT */}
          {gameState.phase === 'GAME_RESULT' && (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-panel p-8 rounded-2xl text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <h3 className={`text-3xl font-black ${gameState.winnerTeam === 'IMPOSTER' ? 'text-brand-bright' : 'text-white'}`}>
                {gameState.winnerTeam} TEAM WINS!
              </h3>
              <p className="text-xs text-text-muted max-w-md">{gameState.winReason}</p>

              {gameState.secretWordRevealed && (
                <div className="bg-card px-6 py-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">The Secret Word Was:</span>
                  <span className="text-2xl font-black text-white font-mono tracking-widest">{gameState.secretWordRevealed}</span>
                </div>
              )}

              <button
                onClick={handleRematch}
                className="px-6 py-3 bg-brand-red hover:bg-brand-bright text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all mt-2"
              >
                <RotateCcw className="w-4 h-4" /> Rematch
              </button>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: SECRET INTEL & ROOM COMMS */}
        <div className="space-y-4 flex flex-col">
          {/* Private Intel */}
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-bold text-text-muted flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-bright" /> Private Intel
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-card font-mono text-white font-bold">
                {mySecret.role}
              </span>
            </div>
            {mySecret.secretWord ? (
              <div>
                <span className="text-[10px] text-text-muted uppercase block">Secret Word:</span>
                <span className="text-base font-black text-white font-mono">{mySecret.secretWord}</span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-brand-bright uppercase block">Category:</span>
                <span className="text-xs font-bold text-white">{mySecret.category || 'General'}</span>
              </div>
            )}
          </div>

          {/* Live Room Comms */}
          <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-brand-bright" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Room Comms</span>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[260px] text-xs pr-1">
              {chatMessages.length === 0 ? (
                <p className="text-neutral-600 italic text-center py-6">No comms yet.</p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-card p-2 rounded-lg border border-white/5">
                    <span className="font-bold text-neutral-300 mr-1">{msg.senderName}:</span>
                    <span className="text-neutral-200">{msg.text}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                placeholder="Say something..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-card border border-white/10 rounded-lg text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-brand-red"
              />
              <button type="submit" className="p-2 bg-brand-red hover:bg-brand-bright text-white rounded-lg">
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between text-xs text-text-muted">
        <span>© 2026 DECEIT</span>
        <span className="font-semibold text-neutral-400">{APP_CONFIG.poweredBy}</span>
      </footer>
    </div>
  );
}
