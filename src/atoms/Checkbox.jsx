"use client"

import "./Checkbox.css"

export function Checkbox({ id, checked, onChange, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="custom-checkbox"
      {...props}
    />
  )
}
