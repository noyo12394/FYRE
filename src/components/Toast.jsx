import React from 'react'

// Cute warning toast that pops in when the player hits the selection limit.
export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__emoji" aria-hidden="true">🚧</span>
      <span className="toast__text">{message}</span>
    </div>
  )
}
