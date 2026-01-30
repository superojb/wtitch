import React from 'react';
import { useSnapshot } from 'valtio';
import { uiStore } from '../store/uiStore';
import { marketStore } from '../store/marketStore';
import { Chart } from './Chart';
import { cn } from '../lib/utils';

export const MultiChartGrid: React.FC = () => {
    const { chartLayout } = useSnapshot(uiStore);
    const { selectedSymbol, symbols } = useSnapshot(marketStore);

    // Determine grid columns and rows based on layout mode
    let gridClass = "grid-cols-1 grid-rows-1";
    let count = 1;

    if (chartLayout === '2x2') {
        gridClass = "grid-cols-2 grid-rows-2";
        count = 4;
    } else if (chartLayout === '2x4') {
        gridClass = "grid-cols-4 grid-rows-2";
        count = 8;
    }

    // Logic to populate grid
    const slots = [];
    // Primary slot (Top Left) is always the selected symbol
    if (selectedSymbol) slots.push(selectedSymbol);
    
    // Fill rest with available symbols that aren't the selected one
    for (const s of symbols) {
        if (slots.length >= count) break;
        if (s !== selectedSymbol) slots.push(s);
    }
    
    // Empty slots padding
    while (slots.length < count) slots.push(null);

    return (
        <div className={cn("h-full w-full grid gap-[1px] bg-vx-border", gridClass)}>
            {slots.map((sym, idx) => (
                <div key={idx} className="bg-vx-bg overflow-hidden relative">
                    <Chart 
                        symbol={sym} 
                        isActive={sym === selectedSymbol}
                    />
                </div>
            ))}
        </div>
    );
};