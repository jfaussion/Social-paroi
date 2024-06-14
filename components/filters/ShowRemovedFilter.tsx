import React, { useId } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import customSelectClassName from '../ui/customSelectClassName';
import { RemovedEnum } from '@/domain/Removed.enum';

type FilterProps = {
  selectedFilters: string | undefined;
  onChange: Function
};

const ShowRemovedFilter: React.FC<FilterProps> = ({ selectedFilters, onChange }) => {
  const removedOnlyLabel = 'Removed Only';
  const mountedOnlyLabel = 'Mounted Only';
  const allLabel = 'All';

  const showRemovedOptions = [
    {
      value: RemovedEnum.Enum.YES,
      label: allLabel
    }, {
      value: RemovedEnum.Enum.NO,
      label: mountedOnlyLabel
    }, {
      value: RemovedEnum.Enum.ONLY,
      label: removedOnlyLabel
    }
  ];

  const getFilterValue = (selectedFilters: string | undefined) => {
    if (!selectedFilters) return undefined;
    return {
      value: selectedFilters,
      label: getFilterLabel(selectedFilters)
    }
  }

  const getFilterLabel = (selectedFilters: string | undefined) => {
    const filter = showRemovedOptions.find(option => option.value === selectedFilters);
    return filter ? filter.label : 'Error: Filter not found';
  }

  return (
    <Select
      instanceId={useId()}
      isSearchable={false}
      name="showRemoved"
      options={showRemovedOptions}
      value={getFilterValue(selectedFilters)}
      className="basic-single"
      classNamePrefix="select"
      isClearable={true}
      onChange={onChange as (newValue: SingleValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => void}
      classNames={customSelectClassName}
      unstyled={true}
      placeholder="Show removed Blocs"
    />
  );
};

export default ShowRemovedFilter;


