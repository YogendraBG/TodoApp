import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
  let mockAddTodo;

  beforeEach(() => {
    mockAddTodo = jest.fn();
  });

  test('renders form elements correctly', () => {
    render(<TodoForm addTodo={mockAddTodo} />);
    
    expect(screen.getByPlaceholderText('Todo title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Medium')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument(); // title input
  });

  test('updates input values when user types', async () => {
    const user = userEvent.setup();
    const { container } = render(<TodoForm addTodo={mockAddTodo} />);
    
    const titleInput = screen.getByPlaceholderText('Todo title');
    const dueDateInput = container.querySelector('input[name="dueDate"]');
    const prioritySelect = screen.getByDisplayValue('Medium');

    await user.type(titleInput, 'Test todo');
    await user.type(dueDateInput, '2024-12-31');
    await user.selectOptions(prioritySelect, 'High');

    expect(titleInput).toHaveValue('Test todo');
    expect(dueDateInput).toHaveValue('2024-12-31');
    expect(prioritySelect).toHaveValue('High');
  });

  test('calls addTodo with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    const { container } = render(<TodoForm addTodo={mockAddTodo} />);
    
    const titleInput = screen.getByPlaceholderText('Todo title');
    const dueDateInput = container.querySelector('input[name="dueDate"]');
    const prioritySelect = screen.getByDisplayValue('Medium');
    const submitButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo');
    await user.type(dueDateInput, '2024-12-31');
    await user.selectOptions(prioritySelect, 'High');
    await user.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'Test todo',
      dueDate: '2024-12-31',
      priority: 'High',
      id: expect.any(Number),
      completed: false,
    });
  });

  test('resets form after successful submission', async () => {
    const user = userEvent.setup();
    const { container } = render(<TodoForm addTodo={mockAddTodo} />);
    
    const titleInput = screen.getByPlaceholderText('Todo title');
    const dueDateInput = container.querySelector('input[name="dueDate"]');
    const prioritySelect = screen.getByDisplayValue('Medium');
    const submitButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo');
    await user.type(dueDateInput, '2024-12-31');
    await user.selectOptions(prioritySelect, 'High');
    await user.click(submitButton);

    expect(titleInput).toHaveValue('');
    expect(dueDateInput).toHaveValue('');
    expect(prioritySelect).toHaveValue('Medium');
  });

  test('does not submit when title is empty', async () => {
    const user = userEvent.setup();
    render(<TodoForm addTodo={mockAddTodo} />);
    
    const submitButton = screen.getByRole('button', { name: 'Add' });
    await user.click(submitButton);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('does not submit when title contains only whitespace', async () => {
    const user = userEvent.setup();
    render(<TodoForm addTodo={mockAddTodo} />);
    
    const titleInput = screen.getByPlaceholderText('Todo title');
    const submitButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, '   ');
    await user.click(submitButton);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('submits with default priority when not changed', async () => {
    const user = userEvent.setup();
    render(<TodoForm addTodo={mockAddTodo} />);
    
    const titleInput = screen.getByPlaceholderText('Todo title');
    const submitButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo');
    await user.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'Test todo',
      dueDate: '',
      priority: 'Medium',
      id: expect.any(Number),
      completed: false,
    });
  });

  test('submits without due date when not provided', async () => {
    const user = userEvent.setup();
    render(<TodoForm addTodo={mockAddTodo} />);
    
    const titleInput = screen.getByPlaceholderText('Todo title');
    const submitButton = screen.getByRole('button', { name: 'Add' });

    await user.type(titleInput, 'Test todo');
    await user.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'Test todo',
      dueDate: '',
      priority: 'Medium',
      id: expect.any(Number),
      completed: false,
    });
  });
});