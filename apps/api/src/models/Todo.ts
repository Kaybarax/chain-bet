import mongoose, { Schema, Document } from 'mongoose';
import { TodoPriority, TodoStatus } from '@todo/services';

/**
 * Interface for Todo document
 */
export interface ITodo extends Document {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  tags: string[];
  schemaVersion: number;
}

/**
 * Schema for Todo model
 */
const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: Object.values(TodoStatus),
      default: TodoStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TodoPriority),
      default: TodoPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
    },
    userId: {
      type: String,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
TodoSchema.index({ status: 1 });
TodoSchema.index({ priority: 1 });
TodoSchema.index({ dueDate: 1 });
TodoSchema.index({ tags: 1 });
TodoSchema.index({ createdAt: -1 });

// Create model if it doesn't exist (for Next.js hot reloading)
export const Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
