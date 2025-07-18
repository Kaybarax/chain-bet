import React from 'react';
import { Market, MarketSelection } from './Market';

export interface BTTSMarketProps {
  id: string;
  selections: MarketSelection[];
  onSelectionClick?: (selection: MarketSelection) => void;
  selectedSelections?: string[];
  time?: 'FT' | 'HT';
}

const BTTSMarket: React.FC<BTTSMarketProps> = ({
  id,
  selections,
  onSelectionClick,
  selectedSelections = [],
  time = 'FT'
}) => {
  const marketName = `Both Teams To Score ${time === 'FT' ? 'Full Time' : 'Half Time'}`;
  
  // Map generic selections to BTTS format
  const mappedSelections = selections.map(selection => {
    let displayName = selection.name;
    if (selection.outcome === 'Yes') {
      displayName = 'Yes (GG)';
    } else if (selection.outcome === 'No') {
      displayName = 'No (NG)';
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
      type="BTTS"
      selections={mappedSelections}
      onSelectionClick={onSelectionClick}
      selectedSelections={selectedSelections}
    />
  );
};

export { BTTSMarket };
