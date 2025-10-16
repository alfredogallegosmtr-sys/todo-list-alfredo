//  *  useState, useEffect: hooks de React. useState crea estado local (variables que al cambiar provocan
// *re-render). useEffect ejecuta código cuando el componente se monta o cuando cambian dependencias.
//  *  ./App.css: estilos. Importarlo aquí aplica estilos al componente.
//  *  PropTypes: librería para declarar tipos de props (útil para depuración). Nota: en este archivo App no
// *recibe props — comentaré eso abajo.

import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";
import './App.css';

// Este es el componente raíz. React renderiza esta función y devuelve JSX (la estructura HTML/JS que ves).
export default function App() {     // define el componente principal

  // *con función: lazy initializer. La función sólo se ejecuta la primera vez que el
  // *componente se renderiza — evita hacer localStorage.getItem en cada render.
  // *useState recibe una función como inicializador () => { ... }. Esto es intencional: la función se ejecuta sólo la primera vez 
  // *que el componente se monta (más eficiente que ejecutar localStorage.getItem en cada render).
  // todos: arreglo de tareas. Cada tarea tendrá (por ejemplo) { id, title, done }.
  // *localStorage.getItem("todos") obtiene la cadena guardada en el navegador. JSON.parse(saved) la convierte en un array de objetos.
  // *try/catch en todos para evitar que un JSON.parse inválido rompa la app.
  // *Si no hay nada guardado o hay error (por ejemplo, JSON inválido), devolvemos [] para evitar romper la app.
  const [todos, setTodos] = useState(() => {
    // Cargar desde localStorage solo una vez
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  //  *filter: cadena que controla el filtro: "all", "active" o "done". Se inicializa desde localStorage o
  // *"all" si no hay nada guardado.
  // *filter: cadena que controla el filtro: "all", "active" o "done". Se inicializa desde localStorage o "all" si no hay nada guardado.
  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("filter");
    return saved || "all";
  });

  // *Estado filter (qué mostrar: todo / activos / hechas)
  // *Guardar tareas en localStorage cada vez que cambien
  // *useEffect con dependencia [todos] significa: cada vez que todos cambie, ejecuta la función.
  // *Guardamos la versión serializada (JSON.stringify) en localStorage así persisten aunque recargues la página.
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // *Guardar filtro en localStorage cada vez que cambie
  // *Igual que arriba, pero para el filtro.
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  // *Funciones de manipulación de tareas
  // *a) Agregar tarea
  // *title viene del formulario (TodoForm).
  // *crypto.randomUUID() genera un id único (moderno; funciona en navegadores recientes).
  // *setTodos(prev => [...prev, newTodo]) usa la forma funcional de actualizar estado (recibe prev para evitar problemas si hay 
  // *muchas actualizaciones simultáneas). ...prev crea una copia del array anterior y añade la nueva tarea al final.
  // *Nota: Si necesitas compatibilidad con navegadores antiguos, añade un fallback para crypto.randomUUID() 
  // *(por ejemplo Date.now() + random).
  const handleAddTodo = (title) => {
    const newTodo = { id: crypto.randomUUID(), title, done: false };
    setTodos(prev => [...prev, newTodo]);
  };

  // *b) Marcar/Desmarcar tarea (toggle)
  // *Recorremos prev con map. Si el id coincide, devolvemos una copia del objeto con done invertido !t.done. Si no coincide 
  // *devolvemos la tarea tal cual.
  // *Importante: no mutamos el objeto original; usamos { ...t, done: !t.done } para crear una nueva referencia — eso ayuda a 
  // *que React detecte cambios correctamente.
  const handleToggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // *c) Borrar tarea
  // *filter devuelve todas las tareas excepto la que tenga el id pasado.
  const handleDeleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // *Filtrar tareas según filter
  // *filteredTodos es la lista que pasamos a TodoList.
  // *Si filter === "active" mostramos solo las no hechas, si done solo las hechas, si all (o cualquier otro) mostramos todo.
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.done;
    if (filter === "done") return todo.done;
    return true;
  });

  // *9) Contadores (pendientes y hechas)
  // *Solo contamos para mostrar en el footer.
  const pendingCount = todos.filter(t => !t.done).length;
  const doneCount = todos.filter(t => t.done).length;


  // TodoForm recibe onAdd (cuando el formulario crea una tarea, llama a onAdd(title)).
  // *FilterBar recibe filter (valor actual) y onFilterChange (función para actualizar el filtro; aquí pasamos 
  // *directamente setFilter porque su firma coincide).
  // TodoList recibe todos (la lista filtrada) y las acciones onToggle y onDelete.
  // *Los componentes hijos son responsables de la UI concreta (inputs, botones, lista), App solo maneja el estado y pasa funciones.
  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1>📝 Lista de Tareas</h1>
        </header>

        <main className="app-main">
          <TodoForm onAdd={handleAddTodo} />
          <FilterBar filter={filter} onFilterChange={setFilter} />
          <TodoList todos={filteredTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
        </main>

        <footer className="app-footer">
          <p>📊 {pendingCount} pendientes / {doneCount} hechas</p>
        </footer>
      </div>
    </div>
  );
}


// *1) Flujo de datos (resumen paso a paso — lo que ocurre cuando el usuario interactúa)
// *Usuario escribe un título en TodoForm y envía.
// *TodoForm llama props.onAdd(title) → handleAddTodo(title) en App.
// *handleAddTodo crea newTodo y actualiza todos con setTodos.
// *React re-renderiza App: todos actualizado, useEffect([todos]) guarda en localStorage.
// *filteredTodos se recalcula según filter y TodoList muestra la nueva tarea.
// *Si el usuario marca la tarea como hecha, TodoList llama onToggle(id) → handleToggleTodo actualiza el estado.
// *Si borra la tarea, onDelete(id) → handleDeleteTodo filtra la tarea.

// *2) Detalles de JavaScript/React que conviene entender
// *Estado inmutable: nunca modifiques el array u objeto original; siempre crea copias (map, filter, spread ...).
// *Funciones de actualización: setTodos(prev => ...) evita condiciones de carrera si hay varias actualizaciones seguidas.
// *Inicializador de useState con función: usado para leer localStorage solo una vez.
// *useEffect con dependencias: el array [todos] define cuándo se corre el efecto. Si lo pones vacío [] solo se ejecuta al montar.
// *JSON: localStorage guarda strings; usa JSON.stringify para guardar arrays/objetos y JSON.parse para leerlos.

// *3) Posibles mejoras / cosas a considerar
// *Compatibilidad crypto.randomUUID(): si necesitas soportar navegadores viejos, usar fallback:
// *const id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
// *Validación en TodoForm: evita títulos vacíos y limpia espacios (title.trim()).
// *Accesibilidad: usa label y aria- cuando tengas inputs y botones para que lectores de pantalla funcionen bien.
// *Optimización: si la lista crece mucho, puedes memoizar filteredTodos con useMemo.
// *PropTypes útiles: mover validaciones a los componentes que sí reciben props (TodoList, FilterBar, TodoForm).
// *Sincronización entre pestañas: localStorage cambia en otra pestaña no provoca re-render en esta. Si quieres sincronizar, escucha el evento window.addEventListener('storage', ...).
// *Confirmación al borrar: para evitar borrados accidentales, pedir confirmación.

// *4) Ejemplo mínimo: añadir una tarea (visualización del proceso)
// *Si todos = [] y llamas handleAddTodo("Comprar leche"):
// *Crea {id: "xxx", title: "Comprar leche", done: false}
// *setTodos(prev => [...prev, newTodo]) → ahora todos = [{...}]
// *localStorage guarda '[{"id":"xxx","title":"Comprar leche","done":false}]'
// *filteredTodos mostrará esa tarea

// *5) Resumen corto (para memorizar)
// *App guarda estado (todos, filter) y lo persiste en localStorage.
// *App pasa funciones a sus hijos para que ellos puedan pedir cambios en el estado (patrón lifting state up).
// *Siempre actualiza estado de forma inmutable y usa useEffect para efectos secundarios (guardar en localStorage).