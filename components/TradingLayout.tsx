import React, { useState, useEffect } from 'react';
import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import { MultiChartGrid } from './MultiChartGrid';

const industrialLayout: IJsonModel = {
  global: {
    tabEnableClose: false,
    tabSetEnableMaximize: true,
    tabSetHeaderHeight: 24,
    tabSetTabStripHeight: 24,
    borderBarSize: 0, 
    splitterSize: 1,
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
        weight: 100,
        children: [
          {
            type: "tabset",
            weight: 85,
            enableClose: false,
            id: "tabset_chart",
            children: [
              { type: "tab", id: "tab_chart", name: "OCTA-GRID", component: "MultiChartGrid", enableClose: false }
            ]
          },
          {
            type: "tabset",
            weight: 15, 
            height: 150,
            enableClose: false,
            id: "tabset_logs",
            children: [
              { type: "tab", id: "tab_logs", name: "SYSTEM STREAM", component: "SystemLogs", enableClose: false }
            ]
          }
        ]
      }
    ]
  }
};

const SystemLogs = () => (
    <div className="h-full w-full bg-vx-bg p-2 font-mono text-[10px] text-vx-text-secondary overflow-y-auto leading-5 select-text">
        <div className="flex gap-2"><span className="text-vx-text-primary opacity-50">10:42:01.450</span> <span className="text-vx-up">[SYS]</span> WSS feed connected: <span className="text-vx-text-primary">wss://stream.binance.com:9443/ws</span></div>
        <div className="flex gap-2"><span className="text-vx-text-primary opacity-50">10:42:01.890</span> <span className="text-vx-up">[SYS]</span> Clock sync: -42ms offset applied</div>
        <div className="flex gap-2"><span className="text-vx-text-primary opacity-50">10:42:02.350</span> <span className="text-vx-accent">[DB]</span> IndexedDB warm start: 1642 symbols loaded</div>
    </div>
);

export const TradingLayout = () => {
  const [model, setModel] = useState<Model | null>(null);
  
  useEffect(() => {
     setModel(Model.fromJson(industrialLayout));
  }, []);

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    if (component === "MultiChartGrid") return <MultiChartGrid />;
    if (component === "SystemLogs") return <SystemLogs />;
    return <div className="p-2 text-xs text-vx-down font-mono">ERR: {component}</div>;
  }

  if (!model) return null;

  return (
    <div className="relative h-full w-full bg-vx-bg">
        <Layout model={model} factory={factory} />
    </div>
  )
}