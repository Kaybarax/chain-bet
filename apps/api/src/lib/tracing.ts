import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { logger } from './logger';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Create a child logger for tracing
const tracingLogger = logger.child({ component: 'tracing' });

/**
 * Initialize OpenTelemetry tracing
 */
export function initTracing() {
  // Only initialize tracing if OTLP endpoint is configured
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT && isProduction) {
    tracingLogger.warn('OpenTelemetry tracing disabled: OTEL_EXPORTER_OTLP_ENDPOINT not set');
    return;
  }

  try {
    const traceExporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    });

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'todo-api',
        [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '0.0.1',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
      }),
      traceExporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          // Enable all auto-instrumentations with default settings
          '@opentelemetry/instrumentation-fs': { enabled: false }, // Disable file system instrumentation (noisy)
          '@opentelemetry/instrumentation-http': {
            enabled: true,
            ignoreIncomingPaths: ['/api/health', '/favicon.ico'],
          },
          '@opentelemetry/instrumentation-mongoose': { enabled: true },
          '@opentelemetry/instrumentation-redis': { enabled: true },
        }),
      ],
    });

    // Start the SDK
    sdk.start();
    tracingLogger.info('OpenTelemetry tracing initialized');

    // Handle shutdown gracefully
    const shutdownHandler = () => {
      sdk.shutdown()
        .then(() => {
          tracingLogger.info('OpenTelemetry tracing shut down');
          process.exit(0);
        })
        .catch((error) => {
          tracingLogger.error({ error }, 'Error shutting down OpenTelemetry tracing');
          process.exit(1);
        });
    };

    process.on('SIGTERM', shutdownHandler);
    process.on('SIGINT', shutdownHandler);
  } catch (error) {
    tracingLogger.error({ error }, 'Failed to initialize OpenTelemetry tracing');
  }
}

/**
 * Create a custom span for manual instrumentation
 * @param name - The name of the span
 * @param fn - The function to execute within the span
 * @param attributes - Optional attributes to add to the span
 * @returns The result of the function
 */
export async function withSpan<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
  const api = require('@opentelemetry/api');
  const tracer = api.trace.getTracer('todo-api');

  return await tracer.startActiveSpan(name, async (span: any) => {
    try {
      // Add attributes to the span
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });

      // Execute the function
      const result = await fn();

      // End the span
      span.end();

      return result;
    } catch (error) {
      // Record the error and end the span
      span.recordException(error as Error);
      span.setStatus({ code: api.SpanStatusCode.ERROR });
      span.end();

      // Re-throw the error
      throw error;
    }
  });
}
