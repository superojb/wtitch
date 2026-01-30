import React, { useLayoutEffect, useRef, useEffect } from 'react';
import * as klinecharts from 'klinecharts';
import { useSnapshot } from 'valtio';
import { marketStore } from '../store/marketStore';

// Define explicit interface to satisfy TypeScript if library types are incomplete or mismatched
interface KlineChartInstance {
    applyNewData: (data: any[]) => void;
    updateData: (data: any) => void;
    resize: () => void;
    [key: string]: any;
}

export const Chart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<KlineChartInstance | null>(null);
  const { selectedSymbol, tickers, clockOffset } = useSnapshot(marketStore);

  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;

    // Guard against import failures
    if (!klinecharts.init) {
        console.error("klinecharts library not loaded correctly");
        return;
    }

    // Initialize chart using namespace access
    // Cast to unknown first then to custom interface to avoid 'conversion of type' errors
    const chart = klinecharts.init(chartContainerRef.current, {
        styles: {
            grid: {
                horizontal: { color: 'rgba(255, 255, 255, 0.1)' },
                vertical: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            candle: {
                bar: {
                    upColor: '#10b981',
                    downColor: '#ef4444',
                    noChangeColor: '#888888'
                }
            }
        }
    }) as unknown as KlineChartInstance;
    
    chartInstanceRef.current = chart;
    
    const now = Date.now() + marketStore.clockOffset;
    const mockData = Array.from({ length: 100 }).map((_, i) => ({
      timestamp: now - (100 - i) * 60 * 1000,
      open: 50000 + Math.random() * 1000,
      high: 51000 + Math.random() * 1000,
      low: 49000 + Math.random() * 1000,
      close: 50500 + Math.random() * 1000,
      volume: Math.random() * 100,
    }));
    
    // Call method on the typed instance
    chart?.applyNewData(mockData);

    const resizeObserver = new ResizeObserver(() => {
        chart?.resize();
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartInstanceRef.current) {
        klinecharts.dispose(chartContainerRef.current!); 
        chartInstanceRef.current = null;
      }
    };
  }, []); 

  useEffect(() => {
      if (chartInstanceRef.current && selectedSymbol) {
          // In production: Fetch klines from Dexie/API here
      }
  }, [selectedSymbol]);

  const currentTicker = selectedSymbol ? tickers[selectedSymbol] : null;
  
  useEffect(() => {
      if (!chartInstanceRef.current || !currentTicker) return;

      const price = parseFloat(currentTicker.lastPrice);
      const timestamp = Date.now() + clockOffset;

      chartInstanceRef.current.updateData({
          timestamp,
          open: price, 
          high: price,
          low: price,
          close: price,
          volume: parseFloat(currentTicker.volume) / 1000
      });

  }, [currentTicker, clockOffset]); 

  if (!selectedSymbol) {
      return (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground bg-card">
              Select a symbol to view chart
          </div>
      );
  }

  return (
    <div className="h-full w-full bg-card relative">
        <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur px-2 py-1 rounded border border-border">
            <h3 className="text-xs font-bold">{selectedSymbol}</h3>
        </div>
        <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
};