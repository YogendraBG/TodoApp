import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockUpdateTodo = jest.fn();
  const mockDeleteTodo = jest.fn();

  const sampleTodo = {
    id: 1,
    title: 'Test todo',
    priority: 'Medium',
    dueDate: '2024-12-31',
    completed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo item in view mode by default', () => {
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByText('Due: 2024-12-31')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  test('does not show due date when not provided', () => {
    const todoWithoutDate = { ...sampleTodo, dueDate: '' };
    render(<TodoItem todo={todoWithoutDate} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  test('shows completed state correctly', () => {
    const completedTodo = { ...sampleTodo, completed: true };
    render(<TodoItem todo={completedTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('completed');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('toggles completion when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockUpdateTodo).toHaveBeenCalledWith(1, { ...sampleTodo, completed: true });
  });

  test('calls deleteTodo when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);

    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });

  test('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Medium')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('updates todo when save button is clicked in edit mode', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    // Modify the todo
    const titleInput = screen.getByDisplayValue('Test todo');
    const prioritySelect = screen.getByDisplayValue('Medium');
    
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated todo');
    await user.selectOptions(prioritySelect, 'High');

    // Save changes
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(mockUpdateTodo).toHaveBeenCalledWith(1, {
      ...sampleTodo,
      title: 'Updated todo',
      priority: 'High',
    });
  });

  test('exits edit mode after saving', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    // Save changes
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    // Should be back in view mode
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  test('cancels edit mode when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    // Modify the todo
    const titleInput = screen.getByDisplayValue('Test todo');
    await user.clear(titleInput);
    await user.type(titleInput, 'Modified todo');

    // Cancel changes
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Should be back in view mode with original data
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });

  test('preserves original values when canceling edit', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    // Cancel without changes
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Enter edit mode again to verify values are preserved
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Medium')).toBeInTheDocument();
  });

  test('applies correct CSS classes based on priority', () => {
    const highPriorityTodo = { ...sampleTodo, priority: 'High' };
    render(<TodoItem todo={highPriorityTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    const priorityElement = screen.getByText('High');
    expect(priorityElement).toHaveClass('priority-high');
  });

  test('requires title input in edit mode', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sampleTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue('Test todo');
    expect(titleInput).toBeRequired();
  });
});