"use client"

import { Button } from "../atoms/Button"
import "./FilterBar.css"

export default function FilterBar({ filter, onFilterChange }) {
  const filters = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Pendientes" },
    { value: "done", label: "Hechas" },
  ]

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <Button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          variant={filter === f.value ? "default" : "outline"}          
          className={filter === f.value ? "filter-btn active" : "filter-btn"}
        >
          {f.label}
        </Button>
      ))}
    </div>
  )
}
