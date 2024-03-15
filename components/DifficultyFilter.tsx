import { DifficultyEnum } from '@/domain/TrackSchema';
import React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import customSelectClassName from './ui/customSelectClassName';

type FilterProps = {
  selectedFilters: string[];
  onChange: Function;
};

const DifficultyFilter: React.FC<FilterProps> = ({ selectedFilters, onChange }) => {
  const difficultyOptions = DifficultyEnum.options.map(difficulty => ({
    value: difficulty,
    label: difficulty
  })).filter(option => option.value !== 'Unknown');


  const getSelectColorForLevel = (level: string, state: 'default' | 'focused'): string => {
    const colorMapping: { [key: string]: { default: string, focused: string } } = {
      Unknown: {
        default: 'text-gray-500',
        focused: 'bg-gray-500 text-white'
      },
      Beginner: {
        default: 'text-gray-50',
        focused: 'bg-gray-100 text-gray-900 hover:bg-gray-50'
      },
      Easy: {
        default: 'text-green-400 hover:bg-green-600',
        focused: 'bg-green-800 text-white hover:bg-green-600'
      },
      Intermediate: {
        default: 'text-blue-400 hover:bg-blue-600',
        focused: 'bg-blue-800 text-white hover:bg-blue-600'
      },
      Advanced: {
        default: 'text-pink-400 hover:bg-pink-600',
        focused: 'bg-pink-800 text-white hover:bg-pink-600'
      },
      Difficult: {
        default: 'text-red-400 hover:bg-red-600',
        focused: 'bg-red-800 text-white hover:bg-red-600'
      },
      FuckingHard: {
        default: 'text-yellow-400 hover:bg-yellow-600',
        focused: 'bg-yellow-800 text-white hover:bg-yellow-600'
      },
      Legendary: {
        default: 'text-gray-500',
        focused: 'bg-black text-white'
      }
    };

    // Fallback for unknown levels
    const defaultMapping = {
      default: 'text-gray-500',
      focused: 'bg-gray-500 text-white'
    };

    // Get the specific mapping for the level or fallback if level is not recognized
    const levelMapping = colorMapping[level] || defaultMapping;

    // Return the class names based on the state
    return levelMapping[state];
  };

  const levelCustomSelectClass = {
    ...customSelectClassName,
    option: ({ data, isDisabled, isFocused, isSelected }: { isDisabled: boolean, isFocused: boolean, isSelected: boolean, data: any }) => [
      isFocused
          ? getSelectColorForLevel(data.value, 'focused') // bg color focused
          : getSelectColorForLevel(data.value, 'default'), // bg color default
      isDisabled
        ? 'text-neutral-800'
        : getSelectColorForLevel(data.value, 'default'),
      'hover:bg-gray-600', // hover bg color
      'py-2',
      'px-3',
      !isDisabled &&
      (isSelected ? 'active:bg-gray-800' : 'active:bg-gray-500')
    ].join(' '),
    multiValue: ({data}: {data: any}) => [
      getSelectColorForLevel(data.value, 'focused'), // Bg color of the chips
      'rounded-sm',
      'm-0.5']
      .join(' '),
    multiValueLabel: ({data}: { data: any }) =>
      ['rounded-sm',
      getSelectColorForLevel(data.value, 'focused'), // Couleur du text des chips
        'text-sm',
        'p-[3px]',
        'pl-[6px]'
      ].join(' '),
  }

  return (
    <Select
      isMulti
      name="difficulties"
      value={selectedFilters.map(filter => ({ value: filter, label: filter }))}
      options={difficultyOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: MultiValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => void}
      classNames={levelCustomSelectClass}
      unstyled={true}
      placeholder="Filter by Difficulty"
    />
  );
};

export default DifficultyFilter;
