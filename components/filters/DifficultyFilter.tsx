import React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { DifficultyEnum } from '@/domain/Difficulty.enum';
import { difficultyCustomSelectClass } from '@/utils/difficulty.utils';

type FilterProps = {
  selectedFilters: string[];
  onChange: Function;
};

const DifficultyFilter: React.FC<FilterProps> = ({ selectedFilters, onChange }) => {
  const difficultyOptions = DifficultyEnum.options.map(difficulty => ({
    value: difficulty,
    label: difficulty
  })).filter(option => option.value !== 'Unknown');


  return (
    <Select
      isMulti
      name="difficulties"
      value={selectedFilters.map(filter => ({ value: filter, label: filter }))}
      options={difficultyOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: MultiValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => void}
      classNames={difficultyCustomSelectClass}
      unstyled={true}
      placeholder="Filter by Difficulty"
    />
  );
};

export default DifficultyFilter;
