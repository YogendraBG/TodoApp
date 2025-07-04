import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';

// Mock TodoItem component to simplify testing
jest.mock('./TodoItem', () => {
  return function MockTodoItem({ todo }) {
    return <div data-testid={`todo-${todo.id}`}>{todo.title}</div>;
  };
});

describe('TodoList', () => {
  const mockUpdateTodo = jest.fn();
  const mockDeleteTodo = jest.fn();

  const sampleTodos = [
    {
      id: 1,
      title: 'High priority task',
      priority: 'High',
      dueDate: '2024-12-31',
      completed: false,
    },
    {
      id: 2,
      title: 'Medium priority task',
      priority: 'Medium',
      dueDate: '2024-12-15',
      completed: false,
    },
    {
      id: 3,
      title: 'Low priority task',
      priority: 'Low',
      dueDate: '2024-12-01',
      completed: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no todos', () => {
    render(<TodoList todos={[]} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    expect(screen.getByText('No todos yet.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('renders todos when provided', () => {
    render(<TodoList todos={sampleTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    expect(screen.getByTestId('todo-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-2')).toBeInTheDocument();
    expect(screen.getByTestId('todo-3')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('renders sort controls', () => {
    render(<TodoList todos={sampleTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Due Date')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Priority' })).toBeInTheDocument();
  });

  test('sorts todos by due date by default', () => {
    render(<TodoList todos={sampleTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const todoItems = screen.getAllByTestId(/^todo-/);
    // Should be sorted by due date: 2024-12-01, 2024-12-15, 2024-12-31
    expect(todoItems[0]).toHaveTextContent('Low priority task');
    expect(todoItems[1]).toHaveTextContent('Medium priority task');
    expect(todoItems[2]).toHaveTextContent('High priority task');
  });

  test('sorts todos by priority when selected', async () => {
    const user = userEvent.setup();
    render(<TodoList todos={sampleTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const sortSelect = screen.getByDisplayValue('Due Date');
    await user.selectOptions(sortSelect, 'Priority');

    const todoItems = screen.getAllByTestId(/^todo-/);
    // Should be sorted by priority: High, Medium, Low
    expect(todoItems[0]).toHaveTextContent('High priority task');
    expect(todoItems[1]).toHaveTextContent('Medium priority task');
    expect(todoItems[2]).toHaveTextContent('Low priority task');
  });

  test('handles todos without due dates in sorting', () => {
    const todosWithoutDates = [
      { id: 1, title: 'Task 1', priority: 'Medium', dueDate: '', completed: false },
      { id: 2, title: 'Task 2', priority: 'High', dueDate: '2024-12-31', completed: false },
      { id: 3, title: 'Task 3', priority: 'Low', dueDate: '', completed: false },
    ];

    render(<TodoList todos={todosWithoutDates} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Should handle empty due dates gracefully
    expect(screen.getByTestId('todo-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-2')).toBeInTheDocument();
    expect(screen.getByTestId('todo-3')).toBeInTheDocument();
  });

  test('maintains sort selection when todos change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TodoList todos={sampleTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />
    );
    
    const sortSelect = screen.getByDisplayValue('Due Date');
    await user.selectOptions(sortSelect, 'Priority');

    // Re-render with updated todos
    const updatedTodos = [...sampleTodos, { id: 4, title: 'New task', priority: 'High', dueDate: '2024-12-20', completed: false }];
    rerender(<TodoList todos={updatedTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    expect(screen.getByDisplayValue('Priority')).toBeInTheDocument();
  });

  test('passes correct props to TodoItem components', () => {
    render(<TodoList todos={sampleTodos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Verify that all todos are rendered (mocked TodoItem will show the title)
    expect(screen.getByText('High priority task')).toBeInTheDocument();
    expect(screen.getByText('Medium priority task')).toBeInTheDocument();
    expect(screen.getByText('Low priority task')).toBeInTheDocument();
  });
});