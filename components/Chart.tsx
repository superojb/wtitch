import React, { useLayoutEffect, useRef, useEffect, memo } from 'react';
import * as klinecharts from 'klinecharts';
import { useSnapshot } from 'valtio';
import { marketStore, selectSymbol } from '../store/marketStore';
import { useVexTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

interface ChartProps {
    symbol?: string | null;
    isActive?: boolean;
}

const ChartComponent: React.FC<ChartProps> = ({ symbol, isActive }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const { tickers, clockOffset } = useSnapshot(marketStore);
  const { getChartStyle, theme } = useVexTheme();

  // 1. Initialization
  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    const chart = klinecharts.init(chartContainerRef.current) as any;
    chartInstanceRef.current = chart;
    
    // Apply initial style from Context
    chart?.setStyles(getChartStyle());
    
    // Initial Dummy Data
    const now = Date.now() + clockOffset;
    const mockData = Array.from({ length: 150 }).map((_, i) => ({
      timestamp: now - (150 - i) * 60 * 1000,
      open: 50000 + Math.random() * 1000,
      high: 51000 + Math.random() * 1000,
      low: 49000 + Math.random() * 1000,
      close: 50500 + Math.random() * 1000,
      volume: Math.random() * 100,
    }));
    
    chart?.applyNewData(mockData);

    const resizeObserver = new ResizeObserver(() => {
        chart?.resize();
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      klinecharts.dispose(chartContainerRef.current!); 
    };
  }, []);

  // 2. Theme Synchronization (Reactive)
  useEffect(() => {
      if(chartInstanceRef.current) {
          chartInstanceRef.current.setStyles(getChartStyle());
      }
  }, [theme, getChartStyle]);

  // 3. Data Flow
  useEffect(() => {
      if (!chartInstanceRef.current || !symbol || !tickers[symbol]) return;
      const t = tickers[symbol];
      const price = parseFloat(t.lastPrice);
      const timestamp = Date.now() + clockOffset;

      chartInstanceRef.current.updateData({
          timestamp,
          open: price, high: price, low: price, close: price,
          volume: parseFloat(t.volume) / 1000
      });
  }, [tickers[symbol || ''], clockOffset]); 

  if (!symbol) return (
      <div className="h-full w-full rounded-2xl bg-vx-glass border border-vx-glass-border backdrop-blur-md flex items-center justify-center">
          <span className="text-vx-text-muted text-xs tracking-widest opacity-30 font-bold">EMPTY SLOT</span>
      </div>
  );

  return (
    <div 
        className={cn(
            "h-full w-full relative group transition-all duration-300 ease-spring overflow-hidden rounded-2xl",
            "bg-vx-glass backdrop-blur-md border",
            isActive 
                ? "border-vx-accent shadow-[0_0_30px_-10px_var(--color-vx-accent-glow)] z-10" 
                : "border-vx-glass-border hover:border-vx-text-secondary/30"
        )}
        onClick={() => selectSymbol(symbol)}
    >
        {/* Header Pill */}
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur border border-white/5 flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono text-vx-text-primary">{symbol}</span>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-vx-accent animate-pulse" />}
        </div>
        
        <div ref={chartContainerRef} className="h-full w-full opacity-90" />
        
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

export const Chart = memo(ChartComponent);