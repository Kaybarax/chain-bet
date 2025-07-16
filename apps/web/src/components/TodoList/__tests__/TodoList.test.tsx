import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import { TodoService } from '@todo/services';
import { Todo, TodoStatus, TodoPriority } from '@todo/services/src/todo/types';

// Mock the TodoService
vi.mock('@todo/services', () => {
  return {
    TodoService: vi.fn().mockImplementation(() => ({
      getTodos: vi.fn(),
      getTodoById: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    })),
  };
});

describe('TodoList', () => {
  const mockApiUrl = 'https://api.example.com';
  let mockTodoService: jest.Mocked<TodoService>;

  // Sample todo data for testing
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      tags: [],
    },
    {
      id: '2',
      title: 'Test Todo 2',
      status: TodoStatus.DONE,
      priority: TodoPriority.HIGH,
      tags: ['important'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockTodoService = new TodoService(mockApiUrl) as jest.Mocked<TodoService>;

    // Default mock implementations
    mockTodoService.getTodos.mockResolvedValue([]);
  });

  it('renders loading state initially', () => {
    render(<TodoList apiUrl={mockApiUrl} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state when fetching todos fails', async () => {
    mockTodoService.getTodos.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<TodoList apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch todos');
    });
  });

  it('renders empty state when no todos exist', async () => {
    mockTodoService.getTodos.mockResolvedValueOnce([]);

    render(<TodoList apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByTestId('no-todos')).toBeInTheDocument();
      expect(screen.getByTestId('no-todos')).toHaveTextContent('No todos yet');
    });
  });

  it('renders todos when they exist', async () => {
    mockTodoService.getTodos.mockResolvedValueOnce(mockTodos);

    render(<TodoList apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByTestId('todo-list')).toBeInTheDocument();
      expect(screen.getByTestId(`todo-item-${mockTodos[0].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`todo-item-${mockTodos[1].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`todo-title-${mockTodos[0].id}`)).toHaveTextContent(mockTodos[0].title);
      expect(screen.getByTestId(`todo-title-${mockTodos[1].id}`)).toHaveTextContent(mockTodos[1].title);
    });
  });

  it('adds a new todo when the add button is clicked', async () => {
    mockTodoService.getTodos.mockResolvedValueOnce([]);

    const newTodo: Todo = {
      id: '3',
      title: 'New Todo',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      tags: [],
    };

    mockTodoService.createTodo.mockResolvedValueOnce(newTodo);

    render(<TodoList apiUrl={mockApiUrl} />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByTestId('no-todos')).toBeInTheDocument();
    });

    // Type in the new todo title
    const input = screen.getByTestId('new-todo-input');
    await userEvent.type(input, 'New Todo');

    // Click the add button
    const addButton = screen.getByTestId('add-todo-button');
    await userEvent.click(addButton);

    // Verify the createTodo method was called with the correct data
    expect(mockTodoService.createTodo).toHaveBeenCalledWith({
      title: 'New Todo',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
    });

    // Wait for the new todo to appear
    await waitFor(() => {
      expect(screen.queryByTestId('no-todos')).not.toBeInTheDocument();
      expect(screen.getByTestId(`todo-item-${newTodo.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`todo-title-${newTodo.id}`)).toHaveTextContent(newTodo.title);
    });
  });

  it('toggles todo status when checkbox is clicked', async () => {
    mockTodoService.getTodos.mockResolvedValueOnce(mockTodos);

    const updatedTodo = {
      ...mockTodos[0],
      status: TodoStatus.DONE,
    };

    mockTodoService.updateTodo.mockResolvedValueOnce(updatedTodo);

    render(<TodoList apiUrl={mockApiUrl} />);

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId(`todo-item-${mockTodos[0].id}`)).toBeInTheDocument();
    });

    // Click the checkbox to toggle status
    const checkbox = screen.getByTestId(`todo-checkbox-${mockTodos[0].id}`);
    await userEvent.click(checkbox);

    // Verify the updateTodo method was called with the correct data
    expect(mockTodoService.updateTodo).toHaveBeenCalledWith(mockTodos[0].id, {
      status: TodoStatus.DONE,
    });

    // Wait for the todo status to update
    await waitFor(() => {
      const todoTitle = screen.getByTestId(`todo-title-${mockTodos[0].id}`);
      expect(todoTitle).toHaveClass('completed');
    });
  });

  it('deletes a todo when delete button is clicked', async () => {
    mockTodoService.getTodos.mockResolvedValueOnce(mockTodos);
    mockTodoService.deleteTodo.mockResolvedValueOnce(true);

    render(<TodoList apiUrl={mockApiUrl} />);

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId(`todo-item-${mockTodos[0].id}`)).toBeInTheDocument();
    });

    // Click the delete button
    const deleteButton = screen.getByTestId(`todo-delete-${mockTodos[0].id}`);
    await userEvent.click(deleteButton);

    // Verify the deleteTodo method was called with the correct id
    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(mockTodos[0].id);

    // Wait for the todo to be removed
    await waitFor(() => {
      expect(screen.queryByTestId(`todo-item-${mockTodos[0].id}`)).not.toBeInTheDocument();
    });
  });

  it('handles error when adding a todo fails', async () => {
    mockTodoService.getTodos.mockResolvedValueOnce([]);
    mockTodoService.createTodo.mockRejectedValueOnce(new Error('Failed to create todo'));

    render(<TodoList apiUrl={mockApiUrl} />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByTestId('no-todos')).toBeInTheDocument();
    });

    // Type in the new todo title
    const input = screen.getByTestId('new-todo-input');
    await userEvent.type(input, 'New Todo');

    // Click the add button
    const addButton = screen.getByTestId('add-todo-button');
    await userEvent.click(addButton);

    // Verify the error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to add todo');
    });
  });
});
