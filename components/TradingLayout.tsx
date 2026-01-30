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
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        let json = defaultLayout;
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple validation to ensure it's a valid model object
                if (parsed && parsed.layout) {
                    json = parsed;
                }
            } catch(e) { 
                console.warn("Failed to parse saved layout, resetting to default", e); 
            }
        }
        setModel(Model.fromJson(json));
    } catch (err) {
        console.error("Critical Layout Error:", err);
        // Fallback
        setModel(Model.fromJson(defaultLayout));
    }
  }, []);

  // Save layout to localStorage whenever it changes
  const onModelChange = (model: Model) => {
     try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJson()));
     } catch(e) { console.error("Save Layout Error", e); }
  };

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    
    // Render Components based on ID
    if (component === "MarketWatch") {
        return (
            <div className="h-full w-full overflow-hidden flex flex-col bg-card">
                <MarketOverview />
            </div>
        );
    }
    
    if (component === "Chart") {
        return <Chart />;
    }
    
    if (component === "OrderBook") {
         return (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-card text-[10px] font-mono">
                 ORDER BOOK NOT CONNECTED
            </div>
        );
    }

    return <div className="p-2 text-xs text-red-500">Unknown: {component}</div>;
  }

  if (!model) return <div className="h-full w-full bg-background flex items-center justify-center text-xs">Loading Layout...</div>;

  return (
    <div className="relative h-full w-full overflow-hidden">
        <Layout 
            model={model} 
            factory={factory} 
            onModelChange={onModelChange} 
            classNameMapper={(className) => {
                if (className === 'flexlayout__layout') return 'bg-background';
                return className;
            }}
        />
    </div>
  )
}