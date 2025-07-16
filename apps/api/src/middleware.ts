import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { httpLogger } from './lib/logger';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Apply the HTTP logger middleware to all API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // In a real middleware, we would use httpLogger here
    // However, Next.js middleware doesn't support traditional Express-style middleware
    // So we'll log the request manually
    const start = Date.now();
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

    // Create a response with the request ID header
    const response = NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    });

    // Add the request ID to the response headers
    response.headers.set('x-request-id', requestId);

    // Log the request (simplified version of what pino-http would do)
    const log = {
      req: {
        id: requestId,
        method: request.method,
        url: request.url,
        headers: {
          'user-agent': request.headers.get('user-agent'),
          'content-type': request.headers.get('content-type'),
          'x-correlation-id': request.headers.get('x-correlation-id'),
        },
      },
      responseTime: Date.now() - start,
    };

    // We can't use the full httpLogger here, but we can use the base logger
    // This will be logged when the middleware runs
    console.log(JSON.stringify(log));

    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
};
