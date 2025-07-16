import { ObjectId } from 'mongodb';

/**
 * Todo item interface
 */
export interface Todo {
  _id?: ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
  schemaVersion: number;
}

/**
 * Current schema version for Todo documents
 */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Create a new Todo object
 */
export function createTodo(data: Partial<Todo>): Todo {
  const now = new Date();

  return {
    title: data.title || '',
    description: data.description,
    completed: data.completed || false,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    userId: data.userId || '',
    priority: data.priority,
    dueDate: data.dueDate,
    tags: data.tags || [],
    schemaVersion: CURRENT_SCHEMA_VERSION
  };
}
