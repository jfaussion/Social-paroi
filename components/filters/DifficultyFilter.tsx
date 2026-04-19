import React, { useId, useEffect, useState } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { useFetchDifficultyLevels, DifficultyLevel } from '@/lib/locations/hooks/useFetchDifficultyLevels';

type FilterProps = {
  selectedFilters: number[];
  onChange: Function;
  locationId: number;
};

const DifficultyFilter: React.FC<FilterProps> = ({ selectedFilters, onChange, locationId }) => {
  const [difficultyOptions, setDifficultyOptions] = useState<{ value: number; label: string; color: string | null; points: number }[]>([]);
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

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
  };

  const formatOptionLabel = (option: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {option.color && (
        <span
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: option.color,
            border: '1px solid #ccc',
            flexShrink: 0,
          }}
        />
      )}
      <span>{option.label}</span>
      {option.points > 0 && (
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
        return { value: filter, label: option?.label ?? `Level ${filter}`, color: option?.color ?? null };
      })}
      options={difficultyOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: MultiValue<{ value: number; label: string; color: string | null }>, actionMeta: ActionMeta<{ value: number; label: string; color: string | null }>) => void}
      classNames={{
        container: () => 'w-full sm:w-48',
        control: () => 'p-2 border rounded bg-white dark:bg-gray-800 text-sm',
        menu: () => 'bg-white dark:bg-gray-800 border rounded mt-1 shadow-lg z-50',
        menuList: () => 'py-1',
      }}
      unstyled={false}
      placeholder="Filter by Difficulty"
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default DifficultyFilter;
