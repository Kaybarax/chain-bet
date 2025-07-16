import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { logger } from './logger';

// Create a child logger for tracing
const tracingLogger = logger.child({ component: 'tracing' });

// Determine if we're in production
const isProduction = import.meta.env.PROD;

/**
 * Initialize OpenTelemetry tracing for the web application
 */
export function initTracing() {
  try {
    // Only initialize tracing if OTLP endpoint is configured or in development
    const endpoint = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!endpoint && isProduction) {
      tracingLogger.warn('OpenTelemetry tracing disabled: VITE_OTEL_EXPORTER_OTLP_ENDPOINT not set');
      return;
    }

    // Create a tracer provider
    const provider = new WebTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'todo-web',
        [SemanticResourceAttributes.SERVICE_VERSION]: import.meta.env.PACKAGE_VERSION || '0.0.1',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: import.meta.env.MODE,
      }),
    });

    // Configure span processor and exporter
    const exporter = new OTLPTraceExporter({
      url: endpoint || 'http://localhost:4318/v1/traces',
    });

    // Use batch processing for better performance
    const spanProcessor = new BatchSpanProcessor(exporter);
    provider.addSpanProcessor(spanProcessor);

    // Register the provider with a context manager
    provider.register({
      contextManager: new ZoneContextManager(),
    });

    // Register instrumentations
    registerInstrumentations({
      instrumentations: [
        // Instrument fetch API
        new FetchInstrumentation({
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [
            // Allow trace header propagation to our API and any other relevant domains
            /localhost:.*/,
            /api\.todo\.com/,
          ],
          // Ignore certain URLs from tracing
          ignoreUrls: [
            // Ignore analytics, tracking, etc.
            /analytics/,
            /telemetry/,
            /stats/,
          ],
        }),
        // Instrument XMLHttpRequest
        new XMLHttpRequestInstrumentation({
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [
            /localhost:.*/,
            /api\.todo\.com/,
          ],
          ignoreUrls: [
            /analytics/,
            /telemetry/,
            /stats/,
          ],
        }),
        // Instrument page load
        new DocumentLoadInstrumentation(),
      ],
    });

    tracingLogger.info('OpenTelemetry tracing initialized');

    // Return the provider for potential manual instrumentation
    return provider;
  } catch (error) {
    tracingLogger.error({ error }, 'Failed to initialize OpenTelemetry tracing');
    return null;
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
  try {
    const api = await import('@opentelemetry/api');
    const tracer = api.trace.getTracer('todo-web');

    return await tracer.startActiveSpan(name, async (span) => {
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
  } catch (error) {
    // If OpenTelemetry is not available, just execute the function
    tracingLogger.warn({ error }, 'OpenTelemetry API not available, executing function without tracing');
    return await fn();
  }
}
