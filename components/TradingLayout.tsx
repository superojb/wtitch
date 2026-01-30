import React, { useState, useEffect } from 'react';
import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import { MultiChartGrid } from './MultiChartGrid';
import { StrategyTelemetry } from './StrategyTelemetry';

// Crystal Layout: Simple two-pane structure. 
// Gaps are handled by the CSS grid inside MultiChartGrid and padding overrides.
const crystalLayout: IJsonModel = {
  global: {
    tabEnableClose: false,
    tabSetEnableMaximize: false,
    tabSetHeaderHeight: 0, // Hidden headers
    borderBarSize: 0, 
    splitterSize: 16, // Large transparent splitter acting as gap
    tabSetMinHeight: 100,
    tabSetMinWidth: 100,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 80,
        enableClose: false,
        id: "tabset_main",
        children: [
          { type: "tab", id: "tab_grid", name: "OCTA-GRID", component: "MultiChartGrid", enableClose: false }
        ]
      },
      {
        type: "tabset",
        weight: 20,
        width: 280,
        enableClose: false,
        id: "tabset_telemetry",
        children: [
          { type: "tab", id: "tab_stats", name: "TELEMETRY", component: "StrategyTelemetry", enableClose: false }
        ]
      }
    ]
  }
};

export const TradingLayout = () => {
  const [model, setModel] = useState<Model | null>(null);
  
  useEffect(() => {
     setModel(Model.fromJson(crystalLayout));
  }, []);

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    if (component === "MultiChartGrid") return <MultiChartGrid />;
    if (component === "StrategyTelemetry") return <StrategyTelemetry />;
    return null;
  }

  if (!model) return null;

  return (
    <div className="relative h-full w-full">
        <Layout model={model} factory={factory} />
    </div>
  )
}