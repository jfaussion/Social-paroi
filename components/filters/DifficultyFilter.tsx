import React, { useId, useEffect, useState } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { useFetchDifficultyLevels } from '@/lib/locations/hooks/useFetchDifficultyLevels';
import customSelectClassName from '../ui/customSelectClassName';

type Option = { value: number; label: string; color: string | null; points: number };

type FilterProps = {
  selectedFilters: number[];
  onChange: Function;
  locationId: number;
};

const DifficultyFilter: React.FC<FilterProps> = ({ selectedFilters, onChange, locationId }) => {
  const [difficultyOptions, setDifficultyOptions] = useState<Option[]>([]);
  const { fetchDifficultyLevels } = useFetchDifficultyLevels();

  useEffect(() => {
    const loadLevels = async () => {
      const levels = await fetchDifficultyLevels(locationId);
      setDifficultyOptions(
        levels
          .filter(l => l.name !== 'Unknown')
          .map(level => ({
            value: level.id,
            label: level.name,
            color: level.color,
            points: level.points
          }))
      );
    };
    loadLevels();
  }, [locationId, fetchDifficultyLevels]);

  const formatOptionLabel = (option: Option, { context }: { context: 'menu' | 'value' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {option.color && (
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: option.color,
            flexShrink: 0,
          }}
        />
      )}
      <span>{option.label}</span>
      {context === 'menu' && option.points > 0 && (
        <span className="text-xs text-gray-500">({option.points} pts)</span>
      )}
    </div>
  );

  return (
    <Select
      isMulti
      isSearchable={false}
      instanceId={useId()}
      name="difficulties"
      value={selectedFilters.map(filter => {
        const option = difficultyOptions.find(o => o.value === filter);
        return { value: filter, label: option?.label ?? `Level ${filter}`, color: option?.color ?? null, points: option?.points ?? 0 };
      })}
      options={difficultyOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void}
      classNames={customSelectClassName}
      unstyled={true}
      placeholder="Filter by Difficulty"
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default DifficultyFilter;
