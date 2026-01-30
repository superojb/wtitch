import React, { memo, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore, selectSymbol } from '../store/marketStore';
import { cn } from '../lib/utils';
import { TickerData } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TickerItem = memo(({ symbol, data }: { symbol: string, data: TickerData }) => {
    const prevPrice = useRef(data.lastPrice);
    const dir = useRef<'up' | 'down' | null>(null);

    // Aurora Flash Logic
    if (data.lastPrice !== prevPrice.current) {
        const curr = parseFloat(data.lastPrice);
        const prev = parseFloat(prevPrice.current);
        if (curr > prev) dir.current = 'up';
        else if (curr < prev) dir.current = 'down';
        prevPrice.current = data.lastPrice;
    }

    const pct = parseFloat(data.priceChangePercent);
    const isUp = pct >= 0;
    const glowClass = dir.current === 'up' ? 'shadow-[0_0_15px_var(--color-vx-up-glow)] border-vx-up' : 
                      dir.current === 'down' ? 'shadow-[0_0_15px_var(--color-vx-down-glow)] border-vx-down' : 
                      'border-transparent hover:border-vx-glass-border';

    return (
        <div 
            onClick={() => selectSymbol(symbol)}
            className={cn(
                "group relative flex flex-col justify-center min-w-[100px] h-[50px] px-3 mx-1 rounded-xl cursor-pointer transition-all duration-300 ease-spring",
                "bg-vx-glass backdrop-blur-md border border-vx-glass-border",
                "hover:-translate-y-1 hover:bg-vx-glass-hover",
                glowClass // Apply flash border/shadow
            )}
            onAnimationEnd={() => dir.current = null}
        >
            <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-vx-text-primary tracking-tight">{symbol}</span>
                {isUp ? <TrendingUp className="w-3 h-3 text-vx-up" /> : <TrendingDown className="w-3 h-3 text-vx-down" />}
            </div>
            
            <div className="flex items-baseline gap-2">
                <span className={cn("font-mono text-[11px] font-bold tracking-tight transition-colors", 
                    dir.current === 'up' ? 'text-vx-up' : dir.current === 'down' ? 'text-vx-down' : 'text-vx-text-primary'
                )}>
                    {parseFloat(data.lastPrice).toFixed(2)}
                </span>
                <span className={cn("font-mono text-[9px] opacity-80", isUp ? 'text-vx-up' : 'text-vx-down')}>
                    {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
                </span>
            </div>
            
            {/* Glossy Shine Overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-vx-glass-shine to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    )
});

export const MarketTicker: React.FC = () => {
    const { symbols, tickers } = useSnapshot(marketStore);

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-end">
            <div className="flex items-center gap-1 p-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-vx-glass-border shadow-2xl max-w-[90vw] overflow-x-auto scrollbar-hide">
                {symbols.map(sym => (
                    <TickerItem 
                        key={sym} 
                        symbol={sym} 
                        data={tickers[sym] || { symbol: sym, lastPrice: '0.00', priceChangePercent: '0.00' } as any}
                    />
                ))}
            </div>
        </div>
    );
};