import React, { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import "./styles.css";

const LOCAL_STORAGE_KEY = "todoListApp.todos";

function App() {
  const [todos, setTodos] = useState([]);

  // Load from local storage
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTodos) setTodos(storedTodos);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    setTodos([todo, ...todos]);
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default App;