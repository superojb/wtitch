import React, { memo } from 'react';
import { Activity, Server, Cpu, Zap, Wifi } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { marketStore } from '../store/marketStore';

const MetricRow = memo(({ label, value, unit, icon: Icon, color = "text-vx-text-primary" }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-vx-glass-border">
        <div className="flex items-center gap-3 text-vx-text-secondary">
            <div className="p-1.5 rounded-md bg-white/5">
                <Icon className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-bold tracking-wide">{label}</span>
        </div>
        <div className="font-mono text-[11px] tabular-nums flex items-baseline gap-1">
            <span className={color}>{value}</span>
            <span className="text-[9px] text-vx-text-muted">{unit}</span>
        </div>
    </div>
));

export const StrategyTelemetry: React.FC = () => {
    const { clockOffset, connectionStatus } = useSnapshot(marketStore);

    return (
        <div className="h-full w-full p-3 pt-0">
             <div className="h-full w-full rounded-2xl bg-vx-glass backdrop-blur-md border border-vx-glass-border p-4 overflow-y-auto shadow-xl">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-vx-glass-border">
                    <Activity className="h-4 w-4 text-vx-accent" />
                    <h2 className="text-[11px] font-bold text-vx-text-primary tracking-widest uppercase">Vex Telemetry</h2>
                </div>

                {/* Node Status */}
                <div className="mb-8">
                    <h3 className="text-[10px] text-vx-text-muted font-bold uppercase mb-3 pl-1">Node Health</h3>
                    <MetricRow label="CPU Load" value="14.2" unit="%" icon={Cpu} />
                    <MetricRow label="Memory" value="2.4" unit="GB" icon={Server} />
                    <MetricRow 
                        label="Latency" 
                        value="24" 
                        unit="ms" 
                        icon={Wifi} 
                        color={connectionStatus === 'connected' ? 'text-vx-up' : 'text-vx-down'}
                    />
                    <MetricRow label="Clock Drift" value={clockOffset} unit="ms" icon={Zap} />
                </div>

                {/* PnL Snapshot */}
                <div>
                    <h3 className="text-[10px] text-vx-text-muted font-bold uppercase mb-3 pl-1">Performance</h3>
                    <div className="rounded-xl bg-black/20 border border-vx-glass-border p-3 space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-vx-text-secondary">Unrealized</span>
                            <span className="font-mono text-sm text-vx-up font-bold text-shadow-sm">+420.69</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-vx-text-secondary">Realized</span>
                            <span className="font-mono text-sm text-vx-text-primary">1,240.00</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-vx-glass-border">
                     <div className="text-[9px] text-vx-text-muted text-center font-mono opacity-50">
                         CRYSTAL ENGINE v4.2.0
                     </div>
                </div>
            </div>
        </div>
    );
};