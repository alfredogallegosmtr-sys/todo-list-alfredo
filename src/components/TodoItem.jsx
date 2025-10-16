import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import "./TodoItem.css";
import PropTypes from "prop-types";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marcar "${todo.title}" como ${todo.done ? "pendiente" : "completada"}`}
      />

      <label htmlFor={`todo-${todo.id}`} className={todo.done ? "todo-title done" : "todo-title"}>
        {todo.title}
      </label>

      <Button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label={`Eliminar tarea "${todo.title}"`}
      >
        ✕
      </Button>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
