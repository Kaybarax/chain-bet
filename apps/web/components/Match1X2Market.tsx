import React from 'react';
import { Market, MarketSelection } from './Market';

export interface Match1X2MarketProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  selections: MarketSelection[];
  onSelectionClick?: (selection: MarketSelection) => void;
  selectedSelections?: string[];
  time?: 'FT' | 'HT' | '10 Mins' | string;
}

const Match1X2Market: React.FC<Match1X2MarketProps> = ({
  id,
  homeTeam,
  awayTeam,
  selections,
  onSelectionClick,
  selectedSelections = [],
  time = 'FT'
}) => {
  const marketName = `1X2 ${time === 'FT' ? 'Full Time' : time === 'HT' ? 'Half Time' : time}`;
  
  // Map generic selections to 1X2 format
  const mappedSelections = selections.map(selection => {
    let displayName = selection.name;
    if (selection.outcome === 'Home') {
      displayName = homeTeam;
    } else if (selection.outcome === 'Away') {
      displayName = awayTeam;
    } else if (selection.outcome === 'Draw') {
      displayName = 'Draw';
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
      type="1X2"
      selections={mappedSelections}
      onSelectionClick={onSelectionClick}
      selectedSelections={selectedSelections}
    />
  );
};

export { Match1X2Market };
