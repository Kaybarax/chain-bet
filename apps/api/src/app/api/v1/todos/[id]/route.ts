import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Todo } from '@/models/Todo';
import { updateTodoSchema } from '@todo/services';
import { z } from 'zod';
import mongoose from 'mongoose';
import { createChildLogger } from '@/lib/logger';

// Create a logger for this route
const logger = createChildLogger('todos-id-route');

/**
 * GET /api/v1/todos/:id
 * Get a single todo by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    // Find todo
    const todo = await Todo.findById(id).lean();

    if (!todo) {
      logger.warn({ id, msg: 'Todo not found' });
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    logger.info({ id, msg: 'Todo retrieved successfully', title: todo.title });
    return NextResponse.json(todo);
  } catch (error) {
    logger.error({ error, id: params.id, msg: 'Error fetching todo' });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/todos/:id
 * Update a todo
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = updateTodoSchema.parse(body);

    // Find and update todo
    const todo = await Todo.findByIdAndUpdate(
      id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!todo) {
      logger.warn({ id, msg: 'Todo not found for update' });
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    logger.info({
      id,
      msg: 'Todo updated successfully',
      title: todo.title,
      updates: Object.keys(validatedData)
    });
    return NextResponse.json(todo);
  } catch (error) {
    logger.error({ error, id: params.id, msg: 'Error updating todo' });

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/todos/:id
 * Delete a todo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    // Find and delete todo
    const todo = await Todo.findByIdAndDelete(id).lean();

    if (!todo) {
      logger.warn({ id, msg: 'Todo not found for deletion' });
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    logger.info({
      id,
      msg: 'Todo deleted successfully',
      title: todo.title
    });
    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ error, id: params.id, msg: 'Error deleting todo' });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
