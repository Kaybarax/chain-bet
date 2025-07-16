import mongoose from 'mongoose';
import { Todo, ITodo } from '../Todo';
import { TodoStatus, TodoPriority } from '@todo/services';

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    models: {},
    model: jest.fn().mockImplementation((name, schema) => {
      return {
        create: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn(),
        countDocuments: jest.fn(),
      };
    }),
    Schema: actualMongoose.Schema,
  };
});

describe('Todo Model', () => {
  it('should have the correct schema fields', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check that all required fields are present
    expect(todoSchema.paths).toHaveProperty('title');
    expect(todoSchema.paths).toHaveProperty('description');
    expect(todoSchema.paths).toHaveProperty('status');
    expect(todoSchema.paths).toHaveProperty('priority');
    expect(todoSchema.paths).toHaveProperty('dueDate');
    expect(todoSchema.paths).toHaveProperty('userId');
    expect(todoSchema.paths).toHaveProperty('tags');
    expect(todoSchema.paths).toHaveProperty('schemaVersion');
    expect(todoSchema.paths).toHaveProperty('createdAt');
    expect(todoSchema.paths).toHaveProperty('updatedAt');
  });

  it('should have required fields', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check that required fields are marked as required
    expect(todoSchema.paths.title.isRequired).toBe(true);
  });

  it('should have default values', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check default values
    expect(todoSchema.paths.status.defaultValue).toBe(TodoStatus.TODO);
    expect(todoSchema.paths.priority.defaultValue).toBe(TodoPriority.MEDIUM);
    expect(todoSchema.paths.tags.defaultValue).toEqual([]);
    expect(todoSchema.paths.schemaVersion.defaultValue).toBe(1);
  });

  it('should have enum values for status', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check enum values
    expect(todoSchema.paths.status.enumValues).toEqual(Object.values(TodoStatus));
  });

  it('should have enum values for priority', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check enum values
    expect(todoSchema.paths.priority.enumValues).toEqual(Object.values(TodoPriority));
  });

  it('should have timestamps enabled', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check that timestamps are enabled
    expect(todoSchema.options.timestamps).toBe(true);
  });

  it('should have indexes defined', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check that indexes are defined
    expect(todoSchema._indexes).toContainEqual([{ status: 1 }, {}]);
    expect(todoSchema._indexes).toContainEqual([{ priority: 1 }, {}]);
    expect(todoSchema._indexes).toContainEqual([{ dueDate: 1 }, {}]);
    expect(todoSchema._indexes).toContainEqual([{ tags: 1 }, {}]);
    expect(todoSchema._indexes).toContainEqual([{ createdAt: -1 }, {}]);
    expect(todoSchema._indexes).toContainEqual([{ userId: 1 }, {}]);
  });

  it('should validate title length', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check title max length validation
    expect(todoSchema.paths.title.options.maxlength[0]).toBe(100);
  });

  it('should validate description length', () => {
    // Get the schema from the model
    const todoSchema = (Todo as any).schema;

    // Check description max length validation
    expect(todoSchema.paths.description.options.maxlength[0]).toBe(500);
  });
});
