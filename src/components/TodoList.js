import React, { useState } from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, updateTodo, deleteTodo }) {
  const [sortKey, setSortKey] = useState("dueDate");

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortKey === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (sortKey === "dueDate") {
      return (a.dueDate || "").localeCompare(b.dueDate || "");
    }
    return 0;
  });

  return (
    <div>
      <div className="sort-controls">
        <label>Sort by: </label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      {sortedTodos.length === 0 ? (
        <p className="empty">No todos yet.</p>
      ) : (
        <ul className="todo-list">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;