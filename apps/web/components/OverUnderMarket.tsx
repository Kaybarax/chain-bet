import React from 'react';
import { Market, MarketSelection } from './Market';

export interface OverUnderMarketProps {
  id: string;
  selections: MarketSelection[];
  onSelectionClick?: (selection: MarketSelection) => void;
  selectedSelections?: string[];
  line?: number; // e.g., 2.5 for Over/Under 2.5 goals
  metric?: string; // e.g., 'Goals', 'Corners', 'Cards'
}

const OverUnderMarket: React.FC<OverUnderMarketProps> = ({
  id,
  selections,
  onSelectionClick,
  selectedSelections = [],
  line = 2.5,
  metric = 'Goals'
}) => {
  const marketName = `Over/Under ${line} ${metric}`;
  
  // Map generic selections to Over/Under format
  const mappedSelections = selections.map(selection => {
    let displayName = selection.name;
    if (selection.outcome === 'Over') {
      displayName = `Over ${line}`;
    } else if (selection.outcome === 'Under') {
      displayName = `Under ${line}`;
    }
    
    return {
      ...selection,
      name: displayName
    };
  });

  return (
    <Market
      id={id}
      name={marketName}
      type="OVER_UNDER"
      selections={mappedSelections}
      onSelectionClick={onSelectionClick}
      selectedSelections={selectedSelections}
    />
  );
};

export { OverUnderMarket };
