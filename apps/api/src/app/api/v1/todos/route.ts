import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Todo } from '@/models/Todo';
import { TodoQueryParams, todoQuerySchema, createTodoSchema, Todo as TodoType } from '@todo/services';
import { z } from 'zod';
import { createChildLogger } from '@/lib/logger';

// Create a logger for this route
const logger = createChildLogger('todos-route');

/**
 * GET /api/v1/todos
 * Get all todos with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams: Partial<TodoQueryParams> = {
      status: searchParams.get('status') as any || undefined,
      priority: searchParams.get('priority') as any || undefined,
      userId: searchParams.get('userId') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : 10,
      sortBy: searchParams.get('sortBy') as any || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
    };

    // Validate query parameters
    const validatedParams = todoQuerySchema.partial().parse(queryParams);

    // Build query
    const query: any = {};
    if (validatedParams.status) query.status = validatedParams.status;
    if (validatedParams.priority) query.priority = validatedParams.priority;
    if (validatedParams.userId) query.userId = validatedParams.userId;
    if (validatedParams.search) {
      query.$or = [
        { title: { $regex: validatedParams.search, $options: 'i' } },
        { description: { $regex: validatedParams.search, $options: 'i' } },
      ];
    }
    if (validatedParams.tags && validatedParams.tags.length > 0) {
      query.tags = { $in: validatedParams.tags };
    }

    // Build sort
    const sortField = validatedParams.sortBy || 'createdAt';
    const sortOrder = validatedParams.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    // Pagination
    const page = validatedParams.page || 1;
    const limit = validatedParams.limit || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const todos = await Todo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Todo.countDocuments(query);

    // Log successful retrieval
    logger.info({
      msg: 'Todos retrieved successfully',
      count: todos.length,
      total,
      page,
      limit,
      query: validatedParams
    });

    return NextResponse.json({
      todos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error({ error, msg: 'Error fetching todos' });

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
 * POST /api/v1/todos
 * Create a new todo
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate request body
    const validatedData = createTodoSchema.parse(body);

    // Create todo
    const todo = await Todo.create(validatedData);

    // Log successful creation
    logger.info({
      msg: 'Todo created successfully',
      todoId: todo._id,
      title: todo.title
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    logger.error({ error, msg: 'Error creating todo' });

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
