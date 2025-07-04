import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('renders app title and main components', () => {
    render(<App />);
    
    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Todo title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  test('can add a new todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const titleInput = screen.getByPlaceholderText('Todo title');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo item');
    await user.click(addButton);

    expect(screen.getByText('Test todo item')).toBeInTheDocument();
  });

  test('shows empty state when no todos', () => {
    render(<App />);
    
    expect(screen.getByText('No todos yet.')).toBeInTheDocument();
  });

  test('can toggle todo completion', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const titleInput = screen.getByPlaceholderText('Todo title');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo item');
    await user.click(addButton);

    // Toggle completion
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test('can delete a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const titleInput = screen.getByPlaceholderText('Todo title');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo item');
    await user.click(addButton);

    // Delete the todo
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);

    expect(screen.queryByText('Test todo item')).not.toBeInTheDocument();
    expect(screen.getByText('No todos yet.')).toBeInTheDocument();
  });

  test('can edit a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const titleInput = screen.getByPlaceholderText('Todo title');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Original todo');
    await user.click(addButton);

    // Edit the todo
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const editInput = screen.getByDisplayValue('Original todo');
    await user.clear(editInput);
    await user.type(editInput, 'Updated todo');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(screen.getByText('Updated todo')).toBeInTheDocument();
    expect(screen.queryByText('Original todo')).not.toBeInTheDocument();
  });

  test('can set priority and due date', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const titleInput = screen.getByPlaceholderText('Todo title');
    const dueDateInput = container.querySelector('input[name="dueDate"]');
    const prioritySelect = screen.getByDisplayValue('Medium');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Important task');
    await user.type(dueDateInput, '2024-12-31');
    await user.selectOptions(prioritySelect, 'High');
    await user.click(addButton);

    expect(screen.getByText('Important task')).toBeInTheDocument();
    expect(screen.getByText('Due: 2024-12-31')).toBeInTheDocument();
    expect(container.querySelector('.todo-priority')).toHaveTextContent('High');
  });

  test('can sort todos by priority', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    // Add multiple todos with different priorities
    const titleInput = screen.getByPlaceholderText('Todo title');
    const prioritySelect = screen.getByDisplayValue('Medium');
    const addButton = screen.getByRole('button', { name: 'Add' });

    // Add high priority todo
    await user.type(titleInput, 'High priority task');
    await user.selectOptions(prioritySelect, 'High');
    await user.click(addButton);

    // Add low priority todo
    await user.type(titleInput, 'Low priority task');
    await user.selectOptions(prioritySelect, 'Low');
    await user.click(addButton);

    // Sort by priority
    const sortSelect = screen.getByDisplayValue('Due Date');
    await user.selectOptions(sortSelect, 'Priority');

    const todoItems = screen.getAllByText(/priority task/);
    expect(todoItems[0]).toHaveTextContent('High priority task');
    expect(todoItems[1]).toHaveTextContent('Low priority task');
  });
});