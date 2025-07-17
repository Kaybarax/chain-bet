import { FastifyInstance } from 'fastify';
import { createTodoHandler, getTodosHandler, updateTodoHandler, deleteTodoHandler } from './handlers';
import { CreateTodoSchema, UpdateTodoSchema, DeleteTodoSchema } from './schemas';

export async function todoRoutes(fastify: FastifyInstance) {
  // Create todo
  fastify.post('/todos', {
    schema: CreateTodoSchema,
    handler: createTodoHandler,
  });

  // Get todos
  fastify.get('/todos', {
    handler: getTodosHandler,
  });

  // Update todo
  fastify.put('/todos/:id', {
    schema: UpdateTodoSchema,
    handler: updateTodoHandler,
  });

  // Delete todo
  fastify.delete('/todos/:id', {
    schema: DeleteTodoSchema,
    handler: deleteTodoHandler,
  });
}
