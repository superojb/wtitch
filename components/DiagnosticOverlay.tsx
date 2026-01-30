import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore } from '../store/marketStore';

export const DiagnosticOverlay: React.FC = () => {
  const snap = useSnapshot(marketStore);
  const [metrics, setMetrics] = useState({
    windowOk: false,
    styleTags: 0,
    reactConflict: false,
    reactVersion: React.version
  });

  useEffect(() => {
    // 1. Environment Check
    const win = typeof window !== 'undefined';
    
    // 2. CSS/Tailwind Check (Heuristic: Look for style tags or stylesheets)
    // Tailwind v4 browser script injects a style tag
    const styleCount = document.querySelectorAll('style').length;

    // 3. React Version Check
    // If 'React' is exposed globally by a bad dependency, it might differ from our import
    const globalReact = (window as any).React;
    const conflict = globalReact && globalReact !== React;
    
    setMetrics({
      windowOk: win,
      styleTags: styleCount,
      reactConflict: !!conflict,
      reactVersion: React.version
    });
  }, []);

  // 4. Valtio Store Status
  const storeKeyCount = Object.keys(snap).length;

  return (
    <div className="fixed bottom-8 right-2 z-[9999] bg-card/90 backdrop-blur border border-border p-3 rounded-md shadow-2xl text-[10px] font-mono select-none pointer-events-none max-w-[200px]">
      <div className="flex items-center justify-between border-b border-border/50 pb-1 mb-2">
        <span className="font-bold text-primary">SYS DIAGNOSTICS</span>
        <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
      
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-muted-foreground">
        <span>Environment</span>
        <span className={metrics.windowOk ? "text-emerald-500 font-bold" : "text-destructive font-bold"}>
            {metrics.windowOk ? "BROWSER" : "UNKNOWN"}
        </span>
        
        <span>Tailwind/Styles</span>
        <span className={metrics.styleTags > 0 ? "text-emerald-500" : "text-amber-500"}>
            {metrics.styleTags > 0 ? "LOADED" : "MISSING"}
        </span>
        
        <span>Market State</span>
        <span className="text-foreground font-medium">{storeKeyCount} keys</span>
        
        <span>React Ver</span>
        <span>{metrics.reactVersion}</span>
        
        <span>Instance Check</span>
        <span className={metrics.reactConflict ? "text-destructive font-bold animate-pulse" : "text-emerald-500"}>
          {metrics.reactConflict ? "CONFLICT" : "SINGLE"}
        </span>
      </div>
    </div>
  );
};