import React, { useMemo } from 'react'

// A lightweight, dependency-free confetti + sparkle burst. Renders a bunch of
// absolutely-positioned emoji/colored bits that fall and fade via CSS.
const PIECES = ['🎉', '✨', '⭐', '🎊', '💖', '🌟', '🥳']
const COLORS = ['#ff8fab', '#ffd6a5', '#caffbf', '#9bf6ff', '#bdb2ff', '#fdffb6']

export default function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => {
        const useEmoji = i % 3 === 0
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.6,
          duration: 1.6 + Math.random() * 1.4,
          drift: (Math.random() - 0.5) * 40,
          emoji: useEmoji ? PIECES[i % PIECES.length] : null,
          color: COLORS[i % COLORS.length],
          size: 8 + Math.random() * 10,
          rotate: Math.random() * 360,
        }
      }),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className={`confetti__bit ${b.emoji ? 'confetti__bit--emoji' : ''}`}
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            '--drift': `${b.drift}px`,
            '--rot': `${b.rotate}deg`,
            background: b.emoji ? 'transparent' : b.color,
            width: b.emoji ? 'auto' : `${b.size}px`,
            height: b.emoji ? 'auto' : `${b.size}px`,
            fontSize: b.emoji ? `${b.size + 10}px` : undefined,
          }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  )
}
