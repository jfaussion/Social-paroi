import React, { useId } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { holdColorCustomSelectClass } from '@/utils/hold.utils';
import { HoldColorEnum } from '@/domain/HoldColor.enum';

type FilterProps = {
  selectedFilter: string | undefined;
  onChange: Function;
};

const HoldColorFilter: React.FC<FilterProps> = ({ selectedFilter, onChange }) => {
  const holdColorOptions = HoldColorEnum.options.map(color => ({
    value: color,
    label: color
  })).filter(option => option.value !== 'Unknown');


  return (
    <Select
      isSearchable={false}
      instanceId={useId()}
      isClearable
      name="holdColors"
      value={holdColorOptions.find(option => option.value === selectedFilter)}
      options={holdColorOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: SingleValue<{ value: string; label: string }>, actionMeta: ActionMeta<any>) => void}
      classNames={holdColorCustomSelectClass}
      unstyled={true}
      placeholder="Filter by hold color"
    />
  );
};

export default HoldColorFilter;
