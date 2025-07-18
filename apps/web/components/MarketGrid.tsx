import React, { useState } from 'react';
import { Market, MarketSelection } from './Market';
import { Match1X2Market } from './Match1X2Market';
import { BTTSMarket } from './BTTSMarket';
import { OverUnderMarket } from './OverUnderMarket';
import { DoubleChanceMarket } from './DoubleChanceMarket';

export interface MatchMarket {
  id: string;
  name: string;
  type: '1X2' | 'BTTS' | 'OVER_UNDER' | 'DOUBLE_CHANCE';
  selections: MarketSelection[];
  metadata?: {
    homeTeam?: string;
    awayTeam?: string;
    line?: number;
    metric?: string;
    time?: 'FT' | 'HT';
  };
}

export interface MarketGridProps {
  markets: MatchMarket[];
  onSelectionClick?: (selection: MarketSelection & { marketId: string }) => void;
  selectedSelections?: string[];
}

const MarketGrid: React.FC<MarketGridProps> = ({
  markets,
  onSelectionClick,
  selectedSelections = []
}) => {
  const handleSelectionClick = (selection: MarketSelection, marketId: string) => {
    if (onSelectionClick) {
      onSelectionClick({ ...selection, marketId });
    }
  };

  const renderMarket = (market: MatchMarket) => {
    const commonProps = {
      id: market.id,
      selections: market.selections,
      onSelectionClick: (selection: MarketSelection) => handleSelectionClick(selection, market.id),
      selectedSelections
    };

    switch (market.type) {
      case '1X2':
        return (
          <Match1X2Market
            key={market.id}
            {...commonProps}
            homeTeam={market.metadata?.homeTeam || 'Home'}
            awayTeam={market.metadata?.awayTeam || 'Away'}
            time={market.metadata?.time || 'FT'}
          />
        );
      
      case 'BTTS':
        return (
          <BTTSMarket
            key={market.id}
            {...commonProps}
            time={market.metadata?.time || 'FT'}
          />
        );
      
      case 'OVER_UNDER':
        return (
          <OverUnderMarket
            key={market.id}
            {...commonProps}
            line={market.metadata?.line || 2.5}
            metric={market.metadata?.metric || 'Goals'}
          />
        );
      
      case 'DOUBLE_CHANCE':
        return (
          <DoubleChanceMarket
            key={market.id}
            {...commonProps}
            homeTeam={market.metadata?.homeTeam || 'Home'}
            awayTeam={market.metadata?.awayTeam || 'Away'}
            time={market.metadata?.time || 'FT'}
          />
        );
      
      default:
        return (
          <Market
            key={market.id}
            {...commonProps}
            name={market.name}
            type={market.type}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {markets.map(renderMarket)}
      </div>
    </div>
  );
};

export { MarketGrid };
