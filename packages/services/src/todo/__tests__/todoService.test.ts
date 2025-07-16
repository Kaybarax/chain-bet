import axios from 'axios';
import { TodoService } from '../todoService';
import { Todo, TodoStatus, TodoPriority, CreateTodoInput, UpdateTodoInput } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TodoService', () => {
  let todoService: TodoService;
  const baseUrl = 'https://api.example.com';

  // Sample todo data for testing
  const mockTodo: Todo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Todo',
    description: 'This is a test todo',
    status: TodoStatus.TODO,
    priority: TodoPriority.MEDIUM,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    tags: ['test', 'example']
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup axios create mock
    mockedAxios.create.mockReturnValue(mockedAxios as any);

    // Create a new instance of TodoService
    todoService = new TodoService(baseUrl);
  });

  describe('constructor', () => {
    it('should create an instance with the correct baseUrl', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('getTodos', () => {
    it('should fetch all todos successfully', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({
        data: [mockTodo],
      });

      // Call the method
      const result = await todoService.getTodos();

      // Assertions
      expect(mockedAxios.get).toHaveBeenCalledWith('/todos', { params: {} });
      expect(result).toEqual([mockTodo]);
    });

    it('should fetch todos with query parameters', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({
        data: [mockTodo],
      });

      // Query parameters
      const params = {
        status: TodoStatus.TODO,
        priority: TodoPriority.HIGH,
        page: 1,
        limit: 10
      };

      // Call the method
      const result = await todoService.getTodos(params);

      // Assertions
      expect(mockedAxios.get).toHaveBeenCalledWith('/todos', { params });
      expect(result).toEqual([mockTodo]);
    });

    it('should handle errors when fetching todos', async () => {
      // Setup mock error
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      // Call the method and expect it to throw
      await expect(todoService.getTodos()).rejects.toThrow(error);
      expect(mockedAxios.get).toHaveBeenCalledWith('/todos', { params: {} });
    });
  });

  describe('getTodoById', () => {
    it('should fetch a todo by id successfully', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({
        data: mockTodo,
      });

      // Call the method
      const result = await todoService.getTodoById(mockTodo.id!);

      // Assertions
      expect(mockedAxios.get).toHaveBeenCalledWith(`/todos/${mockTodo.id}`);
      expect(result).toEqual(mockTodo);
    });

    it('should handle errors when fetching a todo by id', async () => {
      // Setup mock error
      const error = new Error('Todo not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      // Call the method and expect it to throw
      await expect(todoService.getTodoById('non-existent-id')).rejects.toThrow(error);
      expect(mockedAxios.get).toHaveBeenCalledWith('/todos/non-existent-id');
    });
  });

  describe('createTodo', () => {
    it('should create a todo successfully', async () => {
      // Setup mock response
      mockedAxios.post.mockResolvedValueOnce({
        data: mockTodo,
      });

      // Input data
      const createTodoInput: CreateTodoInput = {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: TodoStatus.TODO,
        priority: TodoPriority.MEDIUM,
        tags: ['test', 'example']
      };

      // Call the method
      const result = await todoService.createTodo(createTodoInput);

      // Assertions
      expect(mockedAxios.post).toHaveBeenCalledWith('/todos', createTodoInput);
      expect(result).toEqual(mockTodo);
    });

    it('should handle validation errors when creating a todo', async () => {
      // Invalid input (missing required title)
      const invalidInput = {
        description: 'This is an invalid todo',
      } as any;

      // Call the method and expect it to throw
      await expect(todoService.createTodo(invalidInput)).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should handle API errors when creating a todo', async () => {
      // Setup mock error
      const error = new Error('Server error');
      mockedAxios.post.mockRejectedValueOnce(error);

      // Valid input
      const createTodoInput: CreateTodoInput = {
        title: 'Test Todo',
        description: 'This is a test todo',
      };

      // Call the method and expect it to throw
      await expect(todoService.createTodo(createTodoInput)).rejects.toThrow(error);
      expect(mockedAxios.post).toHaveBeenCalledWith('/todos', createTodoInput);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo successfully', async () => {
      // Setup mock response
      const updatedTodo = { ...mockTodo, title: 'Updated Title' };
      mockedAxios.patch.mockResolvedValueOnce({
        data: updatedTodo,
      });

      // Update data
      const updateTodoInput: UpdateTodoInput = {
        title: 'Updated Title',
      };

      // Call the method
      const result = await todoService.updateTodo(mockTodo.id!, updateTodoInput);

      // Assertions
      expect(mockedAxios.patch).toHaveBeenCalledWith(`/todos/${mockTodo.id}`, updateTodoInput);
      expect(result).toEqual(updatedTodo);
    });

    it('should handle API errors when updating a todo', async () => {
      // Setup mock error
      const error = new Error('Server error');
      mockedAxios.patch.mockRejectedValueOnce(error);

      // Update data
      const updateTodoInput: UpdateTodoInput = {
        title: 'Updated Title',
      };

      // Call the method and expect it to throw
      await expect(todoService.updateTodo('some-id', updateTodoInput)).rejects.toThrow(error);
      expect(mockedAxios.patch).toHaveBeenCalledWith('/todos/some-id', updateTodoInput);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      // Setup mock response
      mockedAxios.delete.mockResolvedValueOnce({
        data: { success: true },
      });

      // Call the method
      const result = await todoService.deleteTodo(mockTodo.id!);

      // Assertions
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/todos/${mockTodo.id}`);
      expect(result).toBe(true);
    });

    it('should handle errors when deleting a todo', async () => {
      // Setup mock error
      const error = new Error('Server error');
      mockedAxios.delete.mockRejectedValueOnce(error);

      // Call the method and expect it to throw
      await expect(todoService.deleteTodo('some-id')).rejects.toThrow(error);
      expect(mockedAxios.delete).toHaveBeenCalledWith('/todos/some-id');
    });
  });
});
