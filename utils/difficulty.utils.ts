import customSelectClassName from "@/components/ui/customSelectClassName";
import { DifficultyType } from "@/domain/Difficulty.enum";
import { getBgColor, getBorderColor, getSelectColor } from "./color.utils";

const difficutlyMapping: { [key: string]: { color: string, points: number } } = {
  Unknown: { color: 'Unknown', points: 0 },
  Beginner: { color: 'White', points: 5 },
  Easy: { color: 'Green', points: 10 },
  Intermediate: { color: 'Blue', points: 30 },
  Advanced: { color: 'Pink', points: 50 },
  Difficult: { color: 'Red', points: 100 },
  FuckingHard: { color: 'Yellow', points: 200 },
  Legendary: { color: 'Black', points: 500 }
}

const getColorForDifficulty = (difficulty: string): string => {
  const difficultyColor = difficutlyMapping[difficulty] || { Unknown: { color: 'Unknown' } };
  return difficultyColor.color;
}

export const getPointsForDifficulty = (difficulty: string): number => {
  const difficultyColor = difficutlyMapping[difficulty] || { Unknown: { points: 0 } };
  return difficultyColor.points;
}

export const getBorderColorForDifficulty = (difficulty: DifficultyType): string => {
  const difficultyColor = getColorForDifficulty(difficulty);
  return getBorderColor(difficultyColor);
};

export const getBgColorForDifficulty = (difficulty: DifficultyType): string => {
  const difficultyColor = getColorForDifficulty(difficulty);
  return getBgColor(difficultyColor);
};

/**
 * Utility for react select
 */
const getSelectColorForDifficulty = (level: string, state: 'default' | 'focused' | 'dot'): string => {
  const difficultyColor = getColorForDifficulty(level);
  return getSelectColor(difficultyColor, state);
};

/**
 * Custom class for react-select
 */
export const difficultyCustomSelectClass = {
  ...customSelectClassName,
  option: ({ data, isDisabled, isFocused, isSelected }: { isDisabled: boolean, isFocused: boolean, isSelected: boolean, data: any }) => [
    isFocused
      ? getSelectColorForDifficulty(data.value, 'focused') // bg color focused
      : isDisabled
        ? 'text-neutral-200 dark:text-neutral-800'
        : getSelectColorForDifficulty(data.value, 'default'),// bg color default
    //'hover:bg-gray-400 dark:hover:bg-gray-600', // hover bg color
    'py-2',
    'px-3',
    !isDisabled &&
    (isSelected ? 'active:bg-gray-200 dark:active:bg-gray-800' : 'active:bg-gray-500')
  ].join(' '),
  multiValue: ({ data }: { data: any }) => [
    getSelectColorForDifficulty(data.value, 'focused'), // Bg color of the chips
    'rounded-sm',
    'm-0.5']
    .join(' '),
  multiValueLabel: ({ data }: { data: any }) =>
    ['rounded-sm',
      getSelectColorForDifficulty(data.value, 'focused'), // Couleur du text des chips
      'text-sm',
      'p-[3px]',
      'pl-[6px]'
    ].join(' '),
  multiValueRemove: ({ isFocused, data }: { isFocused: boolean, data: any }) =>
    [
      'rounded-sm', // Todo change this !!
      isFocused && getSelectColorForDifficulty(data.value, 'focused'),
      'px-1',
    ].join(' '),
  singleValue: ({ data, isDisabled }: { data: any, isDisabled: boolean }) => [
    isDisabled ? 'text-neutral-600 dark:text-neutral-400'
      : getSelectColorForDifficulty(data.value, 'dot'),
    'mx-0.5'
  ].join(' '),
}