"use client";
import React from 'react';
import { Button } from '../ui/Button';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { ContestStatusType } from '@/domain/ContestStatus.enum';

type ContestEditorZoneProps = {
  contestStatus: ContestStatusType;
  isGenerating: boolean;
  isExporting: boolean;
  generateError?: string | null;
  onStatusDialogOpen: () => void;
  onDeleteDialogOpen: () => void;
  onGenerateRanking: () => void;
};

const ContestEditorZone: React.FC<ContestEditorZoneProps> = ({
  contestStatus,
  isGenerating,
  isExporting,
  generateError,
  onStatusDialogOpen,
  onDeleteDialogOpen,
  onGenerateRanking,
}) => {
  return (
    <div className='p-4 w-full border-t-2 border-gray-600 sm:border sm:border-gray-600 sm:rounded-lg dark:bg-gray-900 space-y-2'>
      <h2 className="text-lg font-bold mb-3">Editor zone</h2>
      <div className='flex flex-wrap justify-between gap-2'>
        <Button className='grow' onClick={onStatusDialogOpen}>
          Change Status
        </Button>
        <Button className='grow bg-red-500 text-white' btnType='danger' onClick={onDeleteDialogOpen}>Delete Contest</Button>
      </div>
      <div className='flex flex-wrap justify-between gap-2'>
        <Button
          className='grow'
          btnType={contestStatus === ContestStatusEnum.Enum.Over ? 'primary' : 'secondary'}
          onClick={onGenerateRanking}
          disabled={isGenerating || isExporting}
        >
          {isGenerating ? 'Finalizing...' : contestStatus === ContestStatusEnum.Enum.Over ? 'Regenerate Rankings' : 'Finalize Contest'}
        </Button>
        {generateError && (
          <p className="text-red-500 text-sm w-full mt-1">{generateError}</p>
        )}
      </div>
    </div>
  );
};

export default ContestEditorZone;