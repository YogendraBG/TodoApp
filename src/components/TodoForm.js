import React, { useState } from "react";

const defaultFormState = {
  title: "",
  dueDate: "",
  priority: "Medium",
};

function TodoForm({ addTodo }) {
  const [form, setForm] = useState(defaultFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTodo({
      ...form,
      id: Date.now(),
      completed: false,
    });
    setForm(defaultFormState);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        placeholder="Todo title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
      />
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;