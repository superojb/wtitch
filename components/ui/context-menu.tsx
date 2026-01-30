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

    // Boundary check logic could go here to prevent menu clipping
    const style = {
        top: contextMenu.y,
        left: contextMenu.x,
    };

    return (
        <div 
            ref={menuRef}
            style={style}
            className="fixed z-[9999] min-w-[160px] rounded-md border border-slate-800 bg-slate-950 p-1 shadow-xl animate-in fade-in zoom-in-95 duration-75"
        >
            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
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
            
            <div className="h-[1px] bg-slate-800 my-1" />
            
            <MenuItem 
                icon={<XCircle className="h-3 w-3 text-red-500" />} 
                label="Close" 
                className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
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
            "flex w-full items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-slate-800 hover:text-slate-100 text-slate-400 cursor-pointer",
            className
        )}
        onClick={(e) => {
            e.stopPropagation();
            onClick?.();
        }}
    >
        <span className="mr-2">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {shortcut && <span className="ml-auto text-[10px] tracking-widest text-slate-600">{shortcut}</span>}
    </button>
);