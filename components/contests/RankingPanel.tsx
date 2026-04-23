"use client";
import React from 'react';
import { Button } from '../ui/Button';
import { ContestRankingTypeEnum } from '@/domain/ContestRankingType.enum';
import { ContestRankingType } from '@/domain/ContestRankingType.enum';

type RankingPanelProps = {
  onExport: (type: ContestRankingType) => void;
  isExporting: boolean;
  error?: string | null;
};

const RankingPanel: React.FC<RankingPanelProps> = ({ onExport, isExporting, error }) => {
  return (
    <div className='flex flex-wrap justify-between gap-2 mt-2 mb-4 '>
      <Button
        className='grow'
        btnType='secondary'
        onClick={() => onExport(ContestRankingTypeEnum.Enum.Men)}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Men\'s Ranking'}
      </Button>
      <Button
        className='grow'
        btnType='secondary'
        onClick={() => onExport(ContestRankingTypeEnum.Enum.Women)}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Women\'s Ranking'}
      </Button>
      <Button
        className='grow'
        btnType='secondary'
        onClick={() => onExport(ContestRankingTypeEnum.Enum.Overall)}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Overall Ranking'}
      </Button>
      {error && (
        <p className="text-red-500 text-sm w-full mt-1">{error}</p>
      )}
    </div>
  );
};

export default RankingPanel;