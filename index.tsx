import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("FATAL: Root element not found.");
      return;
    }
    
    // Clear existing content if any (handling hot reload/re-mounts)
    rootElement.innerHTML = '';

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
};

// Strict Wait for Window Load to ensure all styles and scripts are ready
if (document.readyState === 'complete') {
    startApp();
} else {
    window.addEventListener('load', startApp);
}