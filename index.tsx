// Entry Point - Strict Window Load
(async () => {
    const start = async () => {
        const rootElement = document.getElementById('root');
        if (!rootElement) return;

        // Reset Root Content
        rootElement.innerHTML = '';

        try {
            // Dynamic Imports to respect importmap resolution
            const React = await import('react');
            const ReactDOM = await import('react-dom/client');
            const { default: App } = await import('./App');

            const root = ReactDOM.createRoot(rootElement);
            root.render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            );
        } catch (e) {
            console.error("Boot Error:", e);
            rootElement.innerHTML = `<div style="color:#ef4444; padding:20px;">Kernel Panic: ${e.message}</div>`;
        }
    };

    // Strict Wait for Window Load (CSS parsing complete)
    if (document.readyState === 'complete') {
        start();
    } else {
        window.addEventListener('load', start);
    }
})();