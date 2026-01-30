import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun, MonitorPlay } from 'lucide-react';

export const Header: React.FC = () => {
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
  };

  return (
    <header className="flex h-8 items-center justify-between border-b bg-card px-2 shrink-0 select-none">
      <div className="flex items-center gap-2">
        <MonitorPlay className="h-4 w-4 text-primary" />
        <h1 className="text-xs font-bold tracking-tight uppercase">SwayVex <span className="text-muted-foreground font-normal text-[10px]">Terminal</span></h1>
      </div>
      
      <div className="flex items-center gap-1">
        <nav className="flex items-center gap-0.5">
            <Button variant="ghost" size="xs">Trade</Button>
            <Button variant="ghost" size="xs">Markets</Button>
            <Button variant="ghost" size="xs">Portfolio</Button>
        </nav>
        <div className="h-3 w-[1px] bg-border mx-2"></div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-6 w-6 rounded-sm">
            <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
        <Button size="xs" variant="default" className="ml-1">Wallet</Button>
      </div>
    </header>
  );
};