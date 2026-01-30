import React, { useState, useEffect, useRef } from 'react';
import { Layout, Model, TabNode, IJsonModel, Actions } from 'flexlayout-react';
import { MarketOverview } from './MarketOverview';
import { Chart } from './Chart';
import { useSnapshot } from 'valtio';
import { marketStore } from '../store/marketStore';

// 4-Quadrant Industrial Layout with 1px Splitters (Zero Gap)
const defaultLayout: IJsonModel = {
  global: {
    tabEnableClose: false,
    tabSetEnableMaximize: true,
    tabSetHeaderHeight: 24,
    tabSetTabStripHeight: 24,
    borderBarSize: 0, 
    splitterSize: 1, // Strictly 1px to match borders
    tabSetMinHeight: 100,
    tabSetMinWidth: 100,
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
            id: "tabset_market",
            children: [
              { type: "tab", id: "tab_market", name: "MARKET", component: "MarketWatch", enableClose: false }
            ]
          },
          {
            type: "tabset",
            weight: 60, // Center: Main Chart
            enableClose: false,
            id: "tabset_chart",
            children: [
              { type: "tab", id: "tab_chart", name: "CHART", component: "MainChart", enableClose: false }
            ]
          },
          {
            type: "tabset",
            weight: 20, // East: Trading Terminal
            enableClose: false,
            id: "tabset_order",
            children: [
              { type: "tab", id: "tab_order", name: "ORDER", component: "TradingTerminal", enableClose: false }
            ]
          }
        ]
      },
      {
        type: "tabset",
        weight: 20, // South: System Logs
        height: 160,
        enableClose: false,
        id: "tabset_logs",
        children: [
          { type: "tab", id: "tab_logs", name: "LOGS", component: "SystemLogs", enableClose: false }
        ]
      }
    ]
  }
};

const STORAGE_KEY = 'swayvex_industrial_v5';

// High Density Order Entry Component
const TradingTerminal = () => {
    const { selectedSymbol, tickers } = useSnapshot(marketStore);
    const price = selectedSymbol ? tickers[selectedSymbol]?.lastPrice : '0.00';

    return (
        <div className="h-full w-full bg-slate-950 text-slate-400 p-2 flex flex-col gap-3 transition-opacity duration-200 opacity-80 hover:opacity-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Spot</span>
                <span className="text-[10px] font-mono text-slate-100">{selectedSymbol || '--'}</span>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-slate-600">Type</label>
                <div className="flex bg-slate-900 p-0.5 rounded-sm border border-slate-800">
                    <button className="flex-1 text-[10px] py-1 bg-slate-800 text-slate-200 rounded-sm shadow-sm">Limit</button>
                    <button className="flex-1 text-[10px] py-1 text-slate-500 hover:text-slate-300">Market</button>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-slate-600">Price (USDT)</label>
                <div className="relative group">
                    <input 
                        type="text" 
                        className="w-full bg-slate-950 border border-slate-800 text-right text-[11px] font-mono text-white px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors"
                        defaultValue={price} 
                    />
                    <span className="absolute left-2 top-1.5 text-[11px] text-slate-600 group-hover:text-slate-400">$</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-slate-600">Amount</label>
                <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-800 text-right text-[11px] font-mono text-white px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="0.00" 
                />
            </div>
            
            <div className="mt-auto grid grid-cols-2 gap-2">
                <button className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all py-2 rounded-sm text-[10px] font-bold tracking-wide uppercase">
                    Buy
                </button>
                <button className="bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all py-2 rounded-sm text-[10px] font-bold tracking-wide uppercase">
                    Sell
                </button>
            </div>
        </div>
    )
}

const SystemLogs = () => (
    <div className="h-full w-full bg-slate-950 p-2 font-mono text-[10px] text-slate-500 overflow-y-auto leading-5">
        <div className="flex gap-2"><span className="text-slate-700">10:42:01.450</span> <span className="text-emerald-500">[SYSTEM]</span> Connected to WSS feed: wss://stream.binance.com:9443/ws</div>
        <div className="flex gap-2"><span className="text-slate-700">10:42:01.890</span> <span className="text-emerald-500">[SYSTEM]</span> Synchronized clock offset: -42ms</div>
        <div className="flex gap-2"><span className="text-slate-700">10:42:02.100</span> <span className="text-amber-500">[WARN]</span> High latency detected on node sg-1 (145ms)</div>
        <div className="flex gap-2"><span className="text-slate-700">10:42:02.350</span> <span className="text-emerald-500">[INFO]</span> Loaded 1642 symbols from IndexedDB</div>
        <div className="flex gap-2"><span className="text-slate-700">10:42:05.000</span> <span className="text-slate-500">[DEBUG]</span> Garbage collection scheduled (24MB heap)</div>
    </div>
);

export const TradingLayout = () => {
  const [model, setModel] = useState<Model | null>(null);
  const layoutRef = useRef<Layout>(null);
  const { selectedSymbol } = useSnapshot(marketStore);

  useEffect(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
             setModel(Model.fromJson(JSON.parse(saved)));
        } else {
             setModel(Model.fromJson(defaultLayout));
        }
    } catch (err) {
        setModel(Model.fromJson(defaultLayout));
    }
  }, []);

  // UX Enhancement: Auto-focus chart on symbol selection
  useEffect(() => {
    if (model && selectedSymbol) {
        // Find the tabset containing the chart
        const chartTabId = "tab_chart";
        const node = model.getNodeById(chartTabId);
        
        if (node) {
            // Select the tab (makes it active in its set)
            model.doAction(Actions.selectTab(chartTabId));
            
            // Optionally set the tabset as active (visually highlights the pane)
            const parent = node.getParent();
            if (parent) {
                model.doAction(Actions.setActiveTabset(parent.getId()));
            }
        }
    }
  }, [selectedSymbol, model]);

  const onModelChange = (model: Model) => {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJson()));
  };

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    
    if (component === "MarketWatch") return <div className="h-full w-full bg-slate-950 overflow-hidden"><MarketOverview /></div>;
    if (component === "MainChart") return <Chart />;
    if (component === "TradingTerminal") return <TradingTerminal />;
    if (component === "SystemLogs") return <SystemLogs />;

    return <div className="p-2 text-xs text-red-500 font-mono">ERR_CMP: {component}</div>;
  }

  if (!model) return null;

  return (
    <div className="relative h-full w-full bg-slate-950">
        <Layout 
            ref={layoutRef}
            model={model} 
            factory={factory} 
            onModelChange={onModelChange}
        />
    </div>
  )
}