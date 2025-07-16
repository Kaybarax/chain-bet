import React from 'react';
import ReactDOM from 'react-dom/client';
import { initTracing } from './utils/tracing';

// Initialize OpenTelemetry tracing
initTracing();

// Import your main App component here
// import App from './App';

// For now, render a simple placeholder since we don't have the actual App component
const App = () => (
  <div>
    <h1>Todo App</h1>
    <p>This is a placeholder for the Todo application.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
