import React, { useState, useEffect } from 'react';
import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import { MarketOverview } from './MarketOverview';
import { Chart } from './Chart';

const defaultLayout: IJsonModel = {
  global: {
    tabEnableClose: false,
    tabSetEnableMaximize: true,
    borderBarSize: 0,
    tabBorderWidth: 1,
    tabSetHeaderHeight: 24,
    tabSetTabStripHeight: 24,
    splitterSize: 4,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 20,
        minWidth: 200,
        enableClose: false,
        children: [
          {
            type: "tab",
            name: "Market Watch",
            component: "MarketWatch",
            enableClose: false
          }
        ]
      },
      {
        type: "tabset",
        weight: 80,
        enableClose: false,
        children: [
          {
            type: "tab",
            name: "Chart",
            component: "Chart",
            enableClose: false
          },
          {
            type: "tab",
            name: "Order Book",
            component: "OrderBook",
            enableClose: false
          }
        ]
      }
    ]
  }
};

const STORAGE_KEY = 'swayvex_layout_v1';

export const TradingLayout = () => {
  const [model, setModel] = useState<Model | null>(null);

  // Load layout from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let json = defaultLayout;
    
    if (saved) {
      try {
        json = JSON.parse(saved);
      } catch(e) { 
        console.error("Failed to parse saved layout", e); 
      }
    }
    
    setModel(Model.fromJson(json));
  }, []);

  // Save layout to localStorage whenever it changes
  const onModelChange = (model: Model) => {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJson()));
  };

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    
    // Render Components based on ID
    if (component === "MarketWatch") {
        return (
            <div className="h-full w-full overflow-hidden flex flex-col">
                <MarketOverview />
            </div>
        );
    }
    
    if (component === "Chart") {
        return <Chart />;
    }
    
    if (component === "OrderBook") {
         return (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-card text-xs">
                 Order Book Placeholder
            </div>
        );
    }

    return <div className="p-2 text-xs">Unknown Component: {component}</div>;
  }

  if (!model) return null;

  return (
    <div className="relative h-full w-full">
        <Layout 
            model={model} 
            factory={factory} 
            onModelChange={onModelChange} 
        />
    </div>
  )
}