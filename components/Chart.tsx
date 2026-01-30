import React, { useLayoutEffect, useRef, useEffect, memo } from 'react';
import * as klinecharts from 'klinecharts';
import { useSnapshot } from 'valtio';
import { marketStore, selectSymbol } from '../store/marketStore';
import { uiStore } from '../store/uiStore';
import { cn } from '../lib/utils';

interface ChartProps {
    symbol?: string | null;
    isActive?: boolean;
}

const ChartComponent: React.FC<ChartProps> = ({ symbol, isActive }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any | null>(null);
  const { tickers, clockOffset } = useSnapshot(marketStore);
  const { theme } = useSnapshot(uiStore);

  // Layout Effect for Init
  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    // determine colors based on theme (simple check)
    const isDark = document.documentElement.classList.contains('dark');
    const bg = isDark ? '#020617' : '#f8fafc';
    const gridColor = isDark ? 'rgba(30, 41, 59, 0.5)' : '#e2e8f0';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Initialize chart
    // Casting to any to avoid TypeScript errors with applyNewData if types are incomplete
    const chart = klinecharts.init(chartContainerRef.current, {
        styles: {
            grid: {
                horizontal: { color: gridColor, style: 'dashed', dashedValue: [2, 2] },
                vertical: { color: gridColor, style: 'dashed', dashedValue: [2, 2] }
            },
            candle: {
                bar: {
                    upColor: isDark ? '#10b981' : '#059669',
                    downColor: isDark ? '#f43f5e' : '#e11d48',
                    noChangeColor: textColor
                },
            },
            xAxis: { tickText: { color: textColor, family: 'JetBrains Mono' } },
            yAxis: { tickText: { color: textColor, family: 'JetBrains Mono' } }
        }
    }) as any;
    
    chartInstanceRef.current = chart;
    
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
  }, [theme]); // Re-init on theme change

  // Data Update Effect
  useEffect(() => {
      if (!chartInstanceRef.current || !symbol || !tickers[symbol]) return;
      const t = tickers[symbol];
      const price = parseFloat(t.lastPrice);
      const timestamp = Date.now() + clockOffset;

      // Ensure updateData is called on the instance
      chartInstanceRef.current.updateData({
          timestamp,
          open: price, high: price, low: price, close: price,
          volume: parseFloat(t.volume) / 1000
      });
  }, [tickers[symbol || ''], clockOffset]); // Only re-run if THIS symbol updates

  if (!symbol) return <div className="h-full w-full bg-vx-surface" />;

  return (
    <div 
        className={cn(
            "h-full w-full relative group transition-all duration-200",
            isActive ? "border-2 border-vx-accent z-10" : "border border-transparent hover:border-vx-border"
        )}
        onClick={() => selectSymbol(symbol)}
    >
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-vx-bg/80 backdrop-blur border border-vx-border">
            <span className="text-[10px] font-bold font-mono text-vx-accent">{symbol}</span>
        </div>
        <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
};

export const Chart = memo(ChartComponent);