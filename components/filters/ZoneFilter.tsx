import React, { useId } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import customSelectClassName from '../ui/customSelectClassName';

type FilterProps = {
  zones: Array<{ id: number; name: string }>;
  selectedFilters: number[];
  onChange: Function;
};

const ZoneFilter: React.FC<FilterProps> = ({ zones, selectedFilters, onChange }) => {
  const zoneOptions = zones.map(z => ({ value: z.id, label: z.name }));

  return (
    <Select
      instanceId={useId()}
      isMulti
      isSearchable={false}
      name="zones"
      value={selectedFilters.map(id => zoneOptions.find(o => o.value === id)).filter(Boolean) as { value: number; label: string }[]}
      options={zoneOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: MultiValue<{ value: number; label: string; }>, actionMeta: ActionMeta<{ value: number; label: string; }>) => void}
      classNames={customSelectClassName}
      unstyled={true}
      placeholder="Filter by Zone"
    />
  );
};

export default ZoneFilter;
