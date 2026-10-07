'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientGameState } from '@deceit/game-types';
import { Eye, Lock } from 'lucide-react';

interface RoleRevealScreenProps {
  gameState: ClientGameState;
}

export function RoleRevealScreen({ gameState }: RoleRevealScreenProps) {
  const { myInfo } = gameState;
  const isImposter = myInfo.role === 'IMPOSTER';
  // Players must actively click to reveal — prevents accidental spoilers
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-8 relative overflow-hidden">

      {/* Header label */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mb-8 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          <Eye size={13} />
          Your Private Role
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
          Make sure nobody else can see the screen.
        </p>
      </motion.div>

      {/* Card — flips on click */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-sm"
        style={{ perspective: 900 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!revealed ? (
            /* ── HIDDEN FACE ── */
            <motion.button
              key="hidden"
              onClick={() => setRevealed(true)}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className="w-full text-center cursor-pointer select-none"
              aria-label="Tap to reveal your role"
              style={{
                background: 'linear-gradient(145deg, rgba(22,22,26,0.98), rgba(13,13,15,0.98))',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 28,
                padding: '48px 32px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Lock icon with pulse */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={28} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.45)' }} />
              </motion.div>

              {/* Pattern background */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 28, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px', pointerEvents: 'none' }} />

              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 6 }}>
                  Tap to reveal your role
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                  Ensure no one else is watching
                </p>
              </div>

              {/* Animated bottom hint */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
              >
                <Eye size={11} /> Private Information
              </motion.div>
            </motion.button>
          ) : (
            /* ── REVEALED FACE ── */
            <motion.div
              key="revealed"
              initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative rounded-3xl p-8 text-center overflow-hidden"
              style={{
                background: isImposter
                  ? 'linear-gradient(145deg, rgba(30,8,8,0.98), rgba(20,5,5,0.98))'
                  : 'linear-gradient(145deg, rgba(18,18,18,0.98), rgba(12,12,12,0.98))',
                border: `1px solid ${isImposter ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isImposter
                  ? '0 24px 60px rgba(229,9,20,0.18), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
                borderRadius: 28,
              }}
            >
              {/* Glow */}
              {isImposter && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 28, background: 'radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.2), transparent 60%)', pointerEvents: 'none' }} />
              )}

              {/* Role badge */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 18 }}
                className="mb-6"
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: isImposter
                      ? 'linear-gradient(135deg, rgba(229,9,20,0.3), rgba(139,0,0,0.2))'
                      : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${isImposter ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.15)'}`,
                    boxShadow: isImposter ? '0 0 30px rgba(229,9,20,0.4)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 36 }}>{isImposter ? '🎭' : '🕵️'}</span>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(36px, 12vw, 56px)',
                    color: isImposter ? '#E50914' : 'white',
                    textShadow: isImposter ? '0 0 40px rgba(229,9,20,0.7)' : 'none',
                    letterSpacing: '-0.02em',
                    fontWeight: 900,
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {myInfo.role}
                </h1>
              </motion.div>

              {/* Divider */}
              <div
                className="h-px w-2/3 mx-auto mb-6"
                style={{
                  background: isImposter
                    ? 'linear-gradient(90deg, transparent, rgba(229,9,20,0.5), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                }}
              />

              {/* Word / Category */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {myInfo.secretWord ? (
                  <div className="space-y-1">
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0, marginBottom: 6 }}>Secret Word</p>
                    <p
                      style={{
                        fontSize: 'clamp(28px, 8vw, 40px)',
                        letterSpacing: '0.08em',
                        fontWeight: 900,
                        color: 'white',
                        margin: 0,
                      }}
                    >
                      {myInfo.secretWord}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 8, margin: '8px 0 0' }}>
                      Category: <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{myInfo.category}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(229,9,20,0.7)', margin: '0 0 8px' }}>
                      {myInfo.category ? 'Your Only Clue' : 'You Know Nothing'}
                    </p>
                    {myInfo.category && (
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>
                        Category: {myInfo.category}
                      </p>
                    )}
                    {myInfo.hint && (
                      <p style={{ color: '#f59e0b', fontSize: 13, fontWeight: 500, margin: '8px 0 0' }}>
                        Hint: &ldquo;{myInfo.hint}&rdquo;
                      </p>
                    )}
                    {!myInfo.category && (
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
                        Blend in. Observe carefully. Deceive everyone.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Footer tip */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 24, lineHeight: 1.55 }}
              >
                {isImposter
                  ? 'Blend in with subtle clues. Deduce the secret word to win.'
                  : 'Give clues that prove you know the word — without revealing it to the Imposter.'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Waiting dots — only show after reveal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>Clue phase starting soon…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

