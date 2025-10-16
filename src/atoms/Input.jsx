"use client"

import React from "react"
import "./Input.css"

export function Input({ value, onChange, type = "text", placeholder = "", ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-input"
      {...props}
    />
  )
}
