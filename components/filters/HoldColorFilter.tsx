import React, { useId } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import customSelectClassName from '../ui/customSelectClassName';

type HoldColorOption = { value: number; label: string; color: string };

type FilterProps = {
  holdColors: { id: number; name: string; color: string }[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
};

const HoldColorFilter: React.FC<FilterProps> = ({ holdColors, selectedIds, onChange }) => {
  const options: HoldColorOption[] = holdColors.map(hc => ({
    value: hc.id,
    label: hc.name,
    color: hc.color,
  }));

  const formatOptionLabel = (option: HoldColorOption) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: option.color,
          flexShrink: 0,
        }}
      />
      <span>{option.label}</span>
    </div>
  );

  const value = selectedIds.map(id => {
    const opt = options.find(o => o.value === id);
    return { value: id, label: opt?.label ?? `Color ${id}`, color: opt?.color ?? '#888888' };
  });

  const handleChange = (newValue: MultiValue<HoldColorOption>, _actionMeta: ActionMeta<HoldColorOption>) => {
    onChange(newValue.map(o => o.value));
  };

  return (
    <Select
      isMulti
      isSearchable={false}
      instanceId={useId()}
      isClearable
      name="holdColorIds"
      value={value}
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={handleChange}
      classNames={customSelectClassName}
      unstyled={true}
      placeholder="Filter by hold color"
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default HoldColorFilter;
