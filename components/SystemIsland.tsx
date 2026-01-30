import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Bell, Activity, Wifi, ChevronDown } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { marketStore } from '../store/marketStore';

export const SystemIsland: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { connectionStatus, clockOffset } = useSnapshot(marketStore);

    return (
        <div 
            className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div 
                className={cn(
                    "relative bg-black text-white rounded-[24px] shadow-2xl transition-all duration-500 ease-spring border border-white/10 overflow-hidden",
                    isExpanded ? "w-[400px] h-[140px] bg-black/90 backdrop-blur-xl" : "w-[180px] h-[36px] bg-black"
                )}
            >
                {/* Collapsed View */}
                <div className={cn("absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300", isExpanded ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", connectionStatus === 'connected' ? "bg-emerald-500" : "bg-rose-500")} />
                        <span className="text-[11px] font-medium tracking-wide">System Active</span>
                    </div>
                    <Activity className="w-3.5 h-3.5 text-white/50" />
                </div>

                {/* Expanded View */}
                <div className={cn("w-full h-full p-5 flex flex-col gap-3 transition-opacity duration-500 delay-100", isExpanded ? "opacity-100" : "opacity-0 pointer-events-none")}>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-white/90">System Telemetry</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">Latency</span>
                            <div className="flex items-center gap-2">
                                <Wifi className="w-3 h-3 text-emerald-400" />
                                <span className="font-mono text-sm text-white">24<span className="text-xs text-white/40">ms</span></span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">Clock Drift</span>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-cyan-400" />
                                <span className="font-mono text-sm text-white">{clockOffset}<span className="text-xs text-white/40">ms</span></span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-auto flex justify-center">
                        <ChevronDown className="w-3 h-3 text-white/20" />
                    </div>
                </div>
            </div>
        </div>
    );
};