// src/atoms/Cerrar.jsx
"use client"

import "./Cerrar.css"

export function Cerrar({ onClick, ariaLabel }) {
  return (
    <button
      className="cerrar-btn"
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      ×
    </button>
  )
}
