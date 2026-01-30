import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun, MonitorPlay, Grid, Square, LayoutGrid } from 'lucide-react';
import { toggleTheme, uiStore, setChartLayout } from '../store/uiStore';
import { useSnapshot } from 'valtio';

export const Header: React.FC = () => {
  const { theme, chartLayout } = useSnapshot(uiStore);

  return (
    <header className="flex h-8 items-center justify-between border-b border-border bg-card px-3 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <MonitorPlay className="h-4 w-4 text-primary" />
        <h1 className="text-xs font-bold tracking-tight uppercase">SwayVex <span className="text-muted-foreground font-normal text-[10px]">QUANT KERNEL</span></h1>
      </div>
      
      <div className="flex items-center gap-0.5">
            <span className="text-[9px] text-muted-foreground mr-2 font-mono uppercase tracking-wider">View Mode</span>
            
            <Button 
                variant={chartLayout === 'single' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setChartLayout('single')}
                title="Single View"
            >
                <Square className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
                variant={chartLayout === '2x2' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setChartLayout('2x2')}
                title="2x2 Grid"
            >
                <Grid className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
                variant={chartLayout === '2x4' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setChartLayout('2x4')}
                title="2x4 Grid"
            >
                <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-6 w-6">
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
};