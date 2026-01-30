import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mount = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("Failed to find root element");
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
} else {
    mount();
}