import React, { useState } from "react";

function TodoItem({ todo, updateTodo, deleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({
    title: todo.title,
    dueDate: todo.dueDate,
    priority: todo.priority,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTodo(todo.id, { ...todo, ...edit });
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            name="title"
            type="text"
            value={edit.title}
            onChange={handleChange}
            required
          />
          <input
            name="dueDate"
            type="date"
            value={edit.dueDate}
            onChange={handleChange}
          />
          <select
            name="priority"
            value={edit.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="todo-view">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => updateTodo(todo.id, { ...todo, completed: !todo.completed })}
          />
          <span className="todo-title">{todo.title}</span>
          {todo.dueDate && <span className="todo-date">Due: {todo.dueDate}</span>}
          <span className={`todo-priority priority-${todo.priority.toLowerCase()}`}>
            {todo.priority}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      )}
    </li>
  );
}

export default TodoItem;