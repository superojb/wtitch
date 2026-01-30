import React, { useState, useEffect } from 'react';
import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import { MarketOverview } from './MarketOverview';
import { Chart } from './Chart';

// 4-Quadrant Industrial Layout
const defaultLayout: IJsonModel = {
  global: {
    tabEnableClose: false,
    tabSetEnableMaximize: true,
    tabSetHeaderHeight: 28,
    tabSetTabStripHeight: 28,
    borderBarSize: 0,
    splitterSize: 2, // Thinner splitters
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "row",
        weight: 80, // Top Section
        children: [
          {
            type: "tabset",
            weight: 20, // West: Market Watch
            enableClose: false,
            children: [
              { type: "tab", name: "MARKET WATCH", component: "MarketWatch", enableClose: false }
            ]
          },
          {
            type: "tabset",
            weight: 60, // Center: Main Chart
            enableClose: false,
            children: [
              { type: "tab", name: "MAIN CHART", component: "MainChart", enableClose: false }
            ]
          },
          {
            type: "tabset",
            weight: 20, // East: Trading Terminal
            enableClose: false,
            children: [
              { type: "tab", name: "TERMINAL", component: "TradingTerminal", enableClose: false }
            ]
          }
        ]
      },
      {
        type: "tabset",
        weight: 20, // South: System Logs
        height: 200,
        enableClose: false,
        children: [
          { type: "tab", name: "SYSTEM LOGS", component: "SystemLogs", enableClose: false }
        ]
      }
    ]
  }
};

const STORAGE_KEY = 'swayvex_industrial_v2';

export const TradingLayout = () => {
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        // Force default if needed during dev, otherwise load saved
        // setModel(Model.fromJson(defaultLayout)); 
        if (saved) {
             setModel(Model.fromJson(JSON.parse(saved)));
        } else {
             setModel(Model.fromJson(defaultLayout));
        }
    } catch (err) {
        setModel(Model.fromJson(defaultLayout));
    }
  }, []);

  const onModelChange = (model: Model) => {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJson()));
  };

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    
    if (component === "MarketWatch") {
        return <div className="h-full w-full bg-card overflow-hidden"><MarketOverview /></div>;
    }
    
    if (component === "MainChart") {
        return <Chart />;
    }
    
    if (component === "TradingTerminal") {
         return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-card text-muted-foreground font-mono text-[11px] border-t border-border">
                <div className="mb-2">ORDER ENTRY</div>
                <button className="px-4 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/20 mb-1 w-32">BUY MKT</button>
                <button className="px-4 py-1 bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 w-32">SELL MKT</button>
            </div>
        );
    }

    if (component === "SystemLogs") {
        return (
            <div className="h-full w-full bg-card p-2 font-mono text-[10px] text-muted-foreground overflow-y-auto">
                <div>[SYSTEM] Connected to WSS feed: wss://stream.binance.com:9443/ws</div>
                <div>[SYSTEM] Synchronized clock offset: -42ms</div>
                <div>[WARN] High latency detected on node sg-1</div>
                <div>[INFO] Loaded 1642 symbols from IndexedDB</div>
            </div>
        );
    }

    return <div className="p-2 text-xs text-red-500">Unknown: {component}</div>;
  }

  if (!model) return null;

  return (
    <div className="relative h-full w-full bg-background">
        <Layout 
            model={model} 
            factory={factory} 
            onModelChange={onModelChange}
        />
    </div>
  )
}