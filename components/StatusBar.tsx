import React from 'react';
import { Terminal } from 'lucide-react';

export const StatusBar: React.FC = () => {
    return (
        <div className="h-5 bg-vx-panel border-t border-vx-border flex items-center px-2 gap-2 select-none overflow-hidden cursor-pointer hover:bg-vx-surface transition-colors">
            <Terminal className="h-3 w-3 text-vx-accent shrink-0" />
            <div className="flex-1 overflow-hidden relative h-full">
                {/* Rolling Text Animation */}
                <div className="absolute top-0 left-0 h-full flex items-center whitespace-nowrap animate-[marquee_20s_linear_infinite]">
                    <span className="text-[9px] font-mono text-vx-text-secondary mr-8">
                        <span className="text-vx-up">[NODE]</span> Connected to NanChong-1 (10.0.0.42)
                    </span>
                    <span className="text-[9px] font-mono text-vx-text-secondary mr-8">
                        <span className="text-vx-accent">[STRAT]</span> Vex-Alpha initialized with 42 pairs
                    </span>
                    <span className="text-[9px] font-mono text-vx-text-secondary mr-8">
                        <span className="text-vx-up">[DB]</span> Dexie Sync Complete (14ms)
                    </span>
                    <span className="text-[9px] font-mono text-vx-text-secondary mr-8">
                        <span className="text-vx-down">[RISK]</span> Exposure check passed: 12% utilized
                    </span>
                </div>
            </div>
            <div className="text-[9px] font-mono text-vx-text-muted shrink-0 border-l border-vx-border pl-2">
                SYS: ONLINE
            </div>
        </div>
    );
};