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

  // Init
  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = klinecharts.init(chartContainerRef.current) as any;
    chartInstanceRef.current = chart;
    chart?.setStyles(getChartStyle());
    
    // Initial Data
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

  // Theme Sync
  useEffect(() => {
      if(chartInstanceRef.current) {
          chartInstanceRef.current.setStyles(getChartStyle());
      }
  }, [theme, getChartStyle]);

  // Data Stream
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

  // Empty State
  if (!symbol) return (
      <div className="h-full w-full rounded-lg bg-vx-surface/50 border-none flex items-center justify-center">
          <span className="text-vx-text-muted text-[10px] tracking-widest font-bold opacity-40">AVAILABLE SLOT</span>
      </div>
  );

  return (
    <div 
        className={cn(
            "h-full w-full relative transition-all duration-200 ease-aurora overflow-hidden rounded-lg",
            "bg-vx-surface", // Solid surface to contrast with deep background
            isActive 
                ? "shadow-[0_0_0_2px_var(--color-vx-accent)] z-10" 
                : "opacity-90 hover:opacity-100"
        )}
        onClick={() => selectSymbol(symbol)}
    >
        {/* Minimal Floating Badge */}
        <div className="absolute top-2 left-3 z-10 flex items-center gap-2 pointer-events-none">
            <span className={cn(
                "text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-vx-bg/80 backdrop-blur text-vx-text-primary",
                isActive ? "text-vx-accent" : ""
            )}>
                {symbol}
            </span>
        </div>
        
        <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
};

export const Chart = memo(ChartComponent);