import { useState } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import "./TodoForm.css";
import PropTypes from "prop-types";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("El título no puede estar vacío");
      return;
    }
    onAdd(trimmedTitle);
    setTitle("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (error) setError(""); }}
          placeholder="Escribe una nueva tarea..."
          className="flex-1"
          aria-label="Nueva tarea"
          aria-invalid={!!error}
          aria-describedby={error ? "error-message" : undefined}
        />
        <Button type="submit" disabled={!title.trim()} className="bg-blue-600 hover:bg-blue-700">
          Agregar
        </Button>
      </div>
      {error && <p id="error-message" role="alert" className="text-sm text-red-600 font-medium">⚠️ {error}</p>}
    </form>
  );
}

TodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
