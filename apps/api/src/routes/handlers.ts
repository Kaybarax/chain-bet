import { FastifyRequest, FastifyReply } from 'fastify';

// Types for todo operations
interface TodoParams {
  id: string;
}

interface CreateTodoBody {
  title: string;
  description?: string;
  completed?: boolean;
}

interface UpdateTodoBody {
  title?: string;
  description?: string;
  completed?: boolean;
}

// In-memory storage for demo purposes
let todos: Array<{
  id: string;
  title: string;
  description: string | undefined;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}> = [];

let nextId = 1;

// Create todo handler
export async function createTodoHandler(
  request: FastifyRequest<{ Body: CreateTodoBody }>,
  reply: FastifyReply
) {
  const { title, description, completed = false } = request.body;

  const todo = {
    id: nextId.toString(),
    title,
    description: description || undefined,
    completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(todo);
  nextId++;

  reply.code(201).send(todo);
}

// Get todos handler
export async function getTodosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send(todos);
}

// Update todo handler
export async function updateTodoHandler(
  request: FastifyRequest<{ Params: TodoParams; Body: UpdateTodoBody }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const updates = request.body;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return reply.code(404).send({ error: 'Todo not found' });
  }

  const currentTodo = todos[todoIndex]!; // Assert non-null since we checked todoIndex
  todos[todoIndex] = {
    id: currentTodo.id,
    title: updates.title ?? currentTodo.title,
    description: updates.description !== undefined ? updates.description : currentTodo.description,
    completed: updates.completed ?? currentTodo.completed,
    createdAt: currentTodo.createdAt,
    updatedAt: new Date(),
  };

  reply.send(todos[todoIndex]);
}

// Delete todo handler
export async function deleteTodoHandler(
  request: FastifyRequest<{ Params: TodoParams }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return reply.code(404).send({ error: 'Todo not found' });
  }

  todos.splice(todoIndex, 1);

  reply.code(204).send();
}
