import axios from 'axios';
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoQueryParams,
  todoSchema,
  createTodoSchema,
  updateTodoSchema,
  todoQuerySchema
} from './types';

/**
 * Service for interacting with the Todo API
 */
export class TodoService {
  private baseUrl: string;
  private apiClient;

  /**
   * Create a new TodoService instance
   * @param baseUrl - The base URL of the Todo API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.apiClient = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get all todos with optional filtering
   * @param params - Query parameters for filtering todos
   * @returns Promise with array of todos
   */
  async getTodos(params?: Partial<TodoQueryParams>): Promise<Todo[]> {
    try {
      // Validate query parameters if provided
      const validParams = params
        ? todoQuerySchema.partial().parse(params)
        : {};

      const response = await this.apiClient.get('/todos', { params: validParams });
      return response.data.map((todo: unknown) => todoSchema.parse(todo));
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  /**
   * Get a single todo by ID
   * @param id - The todo ID
   * @returns Promise with the todo
   */
  async getTodoById(id: string): Promise<Todo> {
    try {
      const response = await this.apiClient.get(`/todos/${id}`);
      return todoSchema.parse(response.data);
    } catch (error) {
      console.error(`Error fetching todo with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new todo
   * @param todo - The todo data
   * @returns Promise with the created todo
   */
  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    try {
      // Validate input data
      const validData = createTodoSchema.parse(todo);

      const response = await this.apiClient.post('/todos', validData);
      return todoSchema.parse(response.data);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  /**
   * Update an existing todo
   * @param id - The todo ID
   * @param todo - The updated todo data
   * @returns Promise with the updated todo
   */
  async updateTodo(id: string, todo: UpdateTodoInput): Promise<Todo> {
    try {
      // Validate input data
      const validData = updateTodoSchema.parse(todo);

      const response = await this.apiClient.patch(`/todos/${id}`, validData);
      return todoSchema.parse(response.data);
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a todo
   * @param id - The todo ID
   * @returns Promise with success status
   */
  async deleteTodo(id: string): Promise<boolean> {
    try {
      await this.apiClient.delete(`/todos/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error);
      throw error;
    }
  }
}
