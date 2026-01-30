import React, { memo } from 'react';
import { Activity, Server, Cpu, Zap, Wifi, TrendingUp } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { marketStore } from '../store/marketStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { cn } from '../lib/utils';

const MetricRow = memo(({ label, value, unit, icon: Icon, color = "text-foreground" }: any) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
        <div className="flex items-center gap-2.5 text-muted-foreground">
            <Icon className="h-3.5 w-3.5 opacity-70" />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </div>
        <div className="font-mono text-[11px] tabular-nums flex items-baseline gap-1">
            <span className={cn("font-semibold", color)}>{value}</span>
            <span className="text-[9px] text-muted-foreground/60">{unit}</span>
        </div>
    </div>
));

export const StrategyTelemetry: React.FC = () => {
    const { clockOffset, connectionStatus } = useSnapshot(marketStore);

    return (
        <div className="h-full w-full p-1 pl-0">
             <Card className="h-full w-full border-border bg-card shadow-sm flex flex-col rounded-none md:rounded-lg">
                <CardHeader className="pb-3 pt-4 px-4 border-b border-border">
                    <CardTitle className="flex items-center gap-2 text-[11px] font-bold text-primary tracking-widest uppercase">
                        <Activity className="h-4 w-4" />
                        Node Telemetry
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-4">
                    {/* Node Status */}
                    <div className="flex-1">
                        <MetricRow label="CPU Load" value="14.2" unit="%" icon={Cpu} />
                        <MetricRow label="Memory" value="2.4" unit="GB" icon={Server} />
                        <MetricRow 
                            label="Latency" 
                            value="24" 
                            unit="ms" 
                            icon={Wifi} 
                            color={connectionStatus === 'connected' ? 'text-emerald-500' : 'text-destructive'}
                        />
                        <MetricRow label="Clock Drift" value={clockOffset} unit="ms" icon={Zap} />
                    </div>

                    {/* PnL Snapshot */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Session PnL</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end p-2.5 rounded bg-muted/30 border border-border/50">
                                <span className="text-[10px] text-muted-foreground">Unrealized</span>
                                <span className="font-mono text-sm text-emerald-500 font-bold">+420.69</span>
                            </div>
                            <div className="flex justify-between items-end p-2.5 rounded bg-muted/30 border border-border/50">
                                <span className="text-[10px] text-muted-foreground">Realized</span>
                                <span className="font-mono text-sm text-foreground">1,240.00</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};