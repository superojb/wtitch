import React, { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { uiStore, closeContextMenu } from '../../store/uiStore';
import { Copy, Bell, Maximize2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const GlobalContextMenu: React.FC = () => {
    const { contextMenu } = useSnapshot(uiStore);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeContextMenu();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeContextMenu();
        };

        if (contextMenu.isOpen) {
            window.addEventListener('mousedown', handleClick);
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [contextMenu.isOpen]);

    if (!contextMenu.isOpen || !contextMenu.symbol) return null;

    const style = {
        top: contextMenu.y,
        left: contextMenu.x,
    };

    return (
        <div 
            ref={menuRef}
            style={style}
            className="fixed z-[9999] min-w-[160px] rounded-md border border-border bg-popover text-popover-foreground p-1 shadow-xl animate-in fade-in zoom-in-95 duration-75"
        >
            <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border mb-1">
                {contextMenu.symbol}
            </div>

            <MenuItem 
                icon={<Copy className="h-3 w-3" />} 
                label="Copy Symbol" 
                onClick={() => {
                    navigator.clipboard.writeText(contextMenu.symbol || '');
                    closeContextMenu();
                }} 
            />
            <MenuItem 
                icon={<Bell className="h-3 w-3" />} 
                label="Set Alert" 
                shortcut="Alt+A"
                onClick={closeContextMenu} 
            />
            <MenuItem 
                icon={<Maximize2 className="h-3 w-3" />} 
                label="Isolate Node" 
                onClick={closeContextMenu} 
            />
            
            <div className="h-[1px] bg-border my-1" />
            
            <MenuItem 
                icon={<XCircle className="h-3 w-3 text-destructive" />} 
                label="Close" 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={closeContextMenu} 
            />
        </div>
    );
};

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    onClick?: () => void;
    className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, shortcut, onClick, className }) => (
    <button 
        className={cn(
            "flex w-full items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground cursor-pointer",
            className
        )}
        onClick={(e) => {
            e.stopPropagation();
            onClick?.();
        }}
    >
        <span className="mr-2">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {shortcut && <span className="ml-auto text-[10px] tracking-widest opacity-60">{shortcut}</span>}
    </button>
);