import React, { useId } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import customSelectClassName from '../ui/customSelectClassName';

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
      value: 'YES',
      label: allLabel
    }, {
      value: 'NO',
      label: mountedOnlyLabel
    }, {
      value: 'ONLY',
      label: removedOnlyLabel
    }
  ];

  return (
    <Select
      instanceId={useId()}
      name="showRemoved"
      options={showRemovedOptions}
      value={selectedFilters ? { value: selectedFilters, label: selectedFilters === 'YES' ? allLabel : selectedFilters === 'NO' ? mountedOnlyLabel : removedOnlyLabel } : undefined}
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


