import React from 'react';
import { SharedButton } from './SharedButton';

export interface MarketSelection {
  id: string;
  name: string;
  odds: number;
  outcome: string;
}

export interface MarketProps {
  id: string;
  name: string;
  type: '1X2' | 'BTTS' | 'OVER_UNDER' | 'DOUBLE_CHANCE';
  selections: MarketSelection[];
  onSelectionClick?: (selection: MarketSelection) => void;
  selectedSelections?: string[];
}

const Market: React.FC<MarketProps> = ({
  id,
  name,
  type,
  selections,
  onSelectionClick,
  selectedSelections = []
}) => {
  const handleSelectionClick = (selection: MarketSelection) => {
    if (onSelectionClick) {
      onSelectionClick(selection);
    } else {
      console.log(`Selected: ${selection.name} @ ${selection.odds}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{type}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {selections.map((selection) => {
          const isSelected = selectedSelections.includes(selection.id);
          return (
            <button
              key={selection.id}
              onClick={() => handleSelectionClick(selection)}
              className={`
                p-3 rounded-md border-2 transition-all duration-200 flex flex-col items-center justify-center
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="font-medium text-sm mb-1">{selection.name}</div>
              <div className="text-lg font-bold">{selection.odds.toFixed(2)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { Market };
