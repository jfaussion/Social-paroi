import React, { useId } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import customSelectClassName from '../ui/customSelectClassName';

type FilterProps = {
  selectedFilters: number[];
  onChange: Function
};

const ZoneFilter: React.FC<FilterProps> = ({ selectedFilters, onChange }) => {
  const zones = Array.from({ length: 11 }, (_, i) => i + 1);
  const zoneOptions = zones.map(zone => ({
    value: zone,
    label: `Zone ${zone}`
  }));

  return (
    <Select
      instanceId={useId()}
      isMulti
      name="zones"
      value={selectedFilters.map(zone => ({ value: zone, label: `Zone ${zone}` }))}
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


