import React from 'react';
import { Market, MarketSelection } from './Market';

export interface DoubleChanceMarketProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  selections: MarketSelection[];
  onSelectionClick?: (selection: MarketSelection) => void;
  selectedSelections?: string[];
  time?: 'FT' | 'HT';
}

const DoubleChanceMarket: React.FC<DoubleChanceMarketProps> = ({
  id,
  homeTeam,
  awayTeam,
  selections,
  onSelectionClick,
  selectedSelections = [],
  time = 'FT'
}) => {
  const marketName = `Double Chance ${time === 'FT' ? 'Full Time' : 'Half Time'}`;
  
  // Map generic selections to Double Chance format
  const mappedSelections = selections.map(selection => {
    let displayName = selection.name;
    if (selection.outcome === '1/X') {
      displayName = `${homeTeam} or Draw`;
    } else if (selection.outcome === 'X/2') {
      displayName = `Draw or ${awayTeam}`;
    } else if (selection.outcome === '1/2') {
      displayName = `${homeTeam} or ${awayTeam}`;
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
      type="DOUBLE_CHANCE"
      selections={mappedSelections}
      onSelectionClick={onSelectionClick}
      selectedSelections={selectedSelections}
    />
  );
};

export { DoubleChanceMarket };
