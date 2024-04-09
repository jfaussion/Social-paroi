import React from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import customSelectClassName from '../ui/customSelectClassName';

type FilterProps = {
  selectedFilters: string | undefined;
  onChange: Function
};

const ShowRemovedFilter: React.FC<FilterProps> = ({ selectedFilters, onChange }) => {
  const showRemovedOptions = [
    {
      value: 'YES',
      label: `Yes`
    }, {
      value: 'NO',
      label: `No`
    }, {
      value: 'ONLY',
      label: `Only`
    }
  ];

  return (
    <Select
      name="showRemoved"
      options={showRemovedOptions}
      value={selectedFilters ? { value: selectedFilters, label: selectedFilters === 'YES' ? 'Yes' : selectedFilters === 'NO' ? 'No' : 'Only' } : undefined}
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


