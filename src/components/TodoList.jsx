// TodoItem: Es un componente hijo que representa una sola tarea (cada elemento de la lista).
// * Este archivo se encargará de mostrar el título, el checkbox, y los botones de acción.
// *"./TodoList.css": Hoja de estilos específica para esta lista. Define, por ejemplo, animaciones o espaciado de los elementos.
// *PropTypes: Se usa para verificar los tipos de las props que recibe el componente (una práctica profesional en React).
// *useState: Hook que se usa aquí para manejar animaciones de salida (cuando una tarea se elimina con efecto visual).

import TodoItem from "./TodoItem";
import "./TodoList.css";
import PropTypes from "prop-types";
import { useState } from "react";

// *Es un componente funcional que recibe tres props desde App.jsx:
// todos: lista de tareas (array de objetos { id, title, done }).
// *onToggle: función para marcar/desmarcar tareas como hechas.
// *onDelete: función para eliminar tareas.
// *Estas funciones se usan para comunicarse con el componente padre (App).

export default function TodoList({ todos, onToggle, onDelete }) {

/*  
*              Estado local: control de animación 
*  exitingId guarda el id de la tarea que está saliendo (animándose para eliminarse).
*Inicialmente null, lo que significa que ninguna tarea está siendo eliminada.
*Al eliminar una tarea, se cambia temporalmente este valor para activar la clase CSS exit, que dispara la animación.

*💡 En pocas palabras:
*Esto permite que al borrar una tarea no desaparezca de golpe, sino que haga una animación de "fade out" o “desvanecerse”.
*/

  const [exitingId, setExitingId] = useState(null);

/* 
*                Función para eliminar con animación
*1. setExitingId(id) → guarda el id de la tarea que va a eliminarse.
*2. Esto hace que en el render, ese li reciba una clase CSS extra: "exit".
*3. La clase "exit" activa la animación CSS (por ejemplo un fadeOutUp que dura 300 ms).
*4. setTimeout espera 300 milisegundos (el mismo tiempo que dura la animación).
*5. Después del tiempo, llama a onDelete(id) → que viene desde App y elimina la tarea realmente del estado.
*6. Finalmente, setExitingId(null) limpia el estado para futuras eliminaciones.

*💡 Consejo:
*Usar el mismo tiempo (300 ms) que el de la animación en CSS es importante para que el efecto se vea sincronizado.
*/

  const handleDelete = (id) => {
    setExitingId(id);
    setTimeout(() => {
      onDelete(id);
      setExitingId(null);
    }, 300); // coincide con la duración de la animación fadeOutUp
  };

/* 
*          Manejo del caso cuando no hay tareas
*Si el array todos está vacío, el componente devuelve este bloque de JSX y no renderiza la lista.
*Esto evita mostrar una lista vacía y en su lugar muestra un mensaje amigable.
*Es una buena práctica para dar retroalimentación visual al usuario.
*/


  if (todos.length === 0) {
    return (
      <div className="empty-list">
        <p>No hay tareas para mostrar</p>
      </div>
    );
  }

/*
*            Renderizado principal de la lista
*<ul className="todo-list">
*Crea una lista HTML (ul) que contendrá los elementos (li) de cada tarea.
*
🔸 {todos.map(...)}
*Recorre el array todos y genera un <li> por cada tarea.
*map devuelve un nuevo array de JSX elementos (una práctica típica en React).

*🔸 key={todo.id}
*React necesita un identificador único (key) para cada elemento de lista.
*Esto ayuda a optimizar el renderizado y evitar errores cuando cambia el orden o contenido.

*🔸 className={todo-item ${exitingId === todo.id ? "exit" : ""}}
*Si exitingId coincide con el id de la tarea actual, agrega la clase "exit".
*Así se activa la animación de salida definida en el CSS (TodoList.css).
*Ejemplo:
*Si exitingId = "123" y todo.id = "123", la clase será "todo-item exit".
*Si no coincide, solo "todo-item".

*🔸 <TodoItem ... />
*Renderiza el componente hijo para mostrar el contenido de la tarea.
*Le pasamos:
*todo: el objeto con los datos (id, título, estado).
*onToggle: función para marcar la tarea hecha o pendiente.
*onDelete: función que llama a handleDelete(todo.id) → controla la animación y luego borra.

*💡 Observación importante:
*onDelete={() => handleDelete(todo.id)} crea una función anónima que guarda el id actual de la tarea, de modo que no se ejecuta inmediatamente sino al hacer clic.
*/

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={`todo-item ${exitingId === todo.id ? "exit" : ""}`}>
          <TodoItem todo={todo} onToggle={onToggle} onDelete={() => handleDelete(todo.id)} />
        </li>
      ))}
    </ul>
  );
}

/* 
*          Validación de tipos con PropTypes
*PropTypes define qué tipo de datos debe recibir el componente.
*isRequired indica que esa prop es obligatoria.
*Esto ayuda a detectar errores si alguien olvida pasar una prop o le pasa el tipo incorrecto.
*Traducción práctica:
*“TodoList necesita que le pasen un array llamado todos y dos funciones (onToggle y onDelete). Si no las recibe, 
*React mostrará una advertencia en consola.”
*/

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
