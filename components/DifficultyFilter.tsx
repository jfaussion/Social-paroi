import { DifficultyEnum } from '@/domain/TrackSchema';
import React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import customStyles from './ui/customSelectStyle';

type FilterProps = {
  selectedFilters: string[];
  onChange: Function;
};

const DifficultyFilter: React.FC<FilterProps> = ({ selectedFilters, onChange }) => {
  const difficultyOptions = DifficultyEnum.options.map(difficulty => ({
    value: difficulty,
    label: difficulty
  })).filter(option => option.value !== 'Unknown');


  const levelStyles = {
    // ... other styles
    ...customStyles,

    option: (provided: { [x: string]: any; }, state: { isSelected: any; isFocused: any; value?: any; }) => {
      let backgroundColor;
      if (state.isSelected) {
        backgroundColor = 'rgb(31, 41, 55)'; // Example selected background color
      } else if (state.isFocused) {
        backgroundColor = 'rgb(55, 65, 81)'; // Example focused background color
      } else {
        backgroundColor = 'rgb(17, 24, 39)'; // Default option background
      }

      return {
        ...provided,
        backgroundColor: getColorVariationsForLevel(state.value, convertState(state) as 'default' | 'selected' | 'focused'),
        color: getColorVariationsForLevel(state.value, convertState(state) as 'default' | 'selected' | 'focused'),
        borderColor: backgroundColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        ':active': {
          ...provided[':active'],
          backgroundColor,
        },
      };
    },
    // Styling for the chips (selected options)
    multiValue: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: getColorVariationsForLevel(data.value, 'default'),
      color: getColorVariationsForLevel(data.value, 'default'), // Set chip text color based on level
    }),
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      color: getColorVariationsForLevel(data.value, 'default'), // Set chip text color based on level
    }),
  }

  const convertState = (state: {isSelected: boolean, isFocused: boolean}) => {
    if (state.isSelected) {
      return 'selected'
    } else if (state.isFocused) {
      return 'focused'
    } else {
      return 'default'
    }
  }

  const getColorVariationsForLevel = (level: string, state: 'default' | 'selected' | 'focused'): string => {
    const colorVariations: { [key: string]: { default: string, selected: string, focused: string } } = {
      Unknown: { default: '#9CA3AF', selected: '#A3A3A3', focused: '#B1B1B1' }, // Example variations
      Beginner: { default: '#FFFFFF', selected: '#E5E5E5', focused: '#CCCCCC' }, // Darker for selected since it's white
      Easy: { default: '#10B981', selected: '#34D399', focused: '#059669' },
      Intermediate: { default: '#3B82F6', selected: '#60A5FA', focused: '#2563EB' },
      Advanced: { default: '#EC4899', selected: '#F472B6', focused: '#DB2777' },
      Difficult: { default: '#EF4444', selected: '#F87171', focused: '#DC2626' },
      FuckingHard: { default: '#F59E0B', selected: '#FCD34D', focused: '#D97706' },
      Legendary: { default: '#000000', selected: '#4B5563', focused: '#1F2937' }, // Lighter for selected since it's black
    };
  
    const variation = colorVariations[level] || colorVariations['Unknown'];
    return variation[state];
  };

  return (
    <Select
      isMulti
      name="difficulties"
      value={selectedFilters.map(filter => ({ value: filter, label: 'Difficulty' }))}
      options={difficultyOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange as (newValue: MultiValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => void}
      styles={levelStyles}
      placeholder="Filter by Difficulty"
    />
  );
};

export default DifficultyFilter;
