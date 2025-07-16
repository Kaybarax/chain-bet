// This file is loaded by Next.js automatically
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { initTracing } from './src/lib/tracing';

// Initialize tracing if not in edge runtime
// Edge runtime doesn't support Node.js-specific modules
export async function register() {
  // Check if we're in a Node.js environment (not Edge)
  if (process.env.NEXT_RUNTIME !== 'edge') {
    // Initialize OpenTelemetry tracing
    initTracing();
  }
}
