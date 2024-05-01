import customSelectClassName from "@/components/ui/customSelectClassName";
import { DifficultyType } from "@/domain/Difficulty.enum";

export const getBorderColorForDifficulty = (difficulty: DifficultyType): string => {
  const difficutltyColorMapping: { [K in DifficultyType]?: string } = {
    Unknown: 'border-gray-500',
    Beginner: 'border-white',
    Easy: 'border-green-500',
    Intermediate: 'border-blue-500',
    Advanced: 'border-pink-500',
    Difficult: 'border-red-500',
    FuckingHard: 'border-yellow-500',
    Legendary: 'border-black',
  };

  return difficutltyColorMapping[difficulty] ?? 'border-gray-500';
};

export const getBgColorForDifficulty = (difficulty: DifficultyType): string => {
  const difficultyColorMapping: { [K in DifficultyType]?: string } = {
    Unknown: 'bg-gray-500',
    Beginner: 'bg-white border dark:border-none border-black',
    Easy: 'bg-green-500',
    Intermediate: 'bg-blue-500',
    Advanced: 'bg-pink-500',
    Difficult: 'bg-red-500',
    FuckingHard: 'bg-yellow-500',
    Legendary: 'bg-black dark:border dark:border-white',
  };

  return difficultyColorMapping[difficulty] ?? 'bg-gray-500';
};


/**
 * Utility for react select
 */
const getSelectColorForDifficulty = (level: string, state: 'default' | 'focused' | 'dot'): string => {
  const colorMapping: { [key: string]: { default: string, focused: string, dot: string } } = {
    Unknown: {
      default: 'text-gray-500',
      focused: 'bg-gray-500 text-white',
      dot: 'flex items-center before:bg-gray-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Beginner: {
      default: 'text-black dark:text-gray-500',
      focused: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      dot: 'flex items-center before:bg-gray-100 before:border before:border-black before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Easy: {
      default: 'text-green-400 hover:bg-green-600 hover:text-white',
      focused: 'bg-green-500 dark:bg-green-800 text-white hover:bg-green-600',
      dot: 'flex items-center before:bg-green-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Intermediate: {
      default: 'text-blue-400 hover:bg-blue-600 hover:text-white',
      focused: 'bg-blue-500 dark:bg-blue-800 text-white hover:bg-blue-600',
      dot: 'flex items-center before:bg-blue-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Advanced: {
      default: 'text-pink-400 hover:bg-pink-600 hover:text-white',
      focused: 'bg-pink-500 dark:bg-pink-800 text-white hover:bg-pink-600',
      dot: 'flex items-center before:bg-pink-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Difficult: {
      default: 'text-red-400 hover:bg-red-600 hover:text-white',
      focused: 'bg-red-600 dark:bg-red-800 text-white hover:bg-red-600',
      dot: 'flex items-center before:bg-red-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    FuckingHard: {
      default: 'text-yellow-400 hover:bg-yellow-600 hover:text-white',
      focused: 'bg-yellow-600 dark:bg-yellow-800 text-white hover:bg-yellow-600',
      dot: 'flex items-center before:bg-yellow-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Legendary: {
      default: 'text-gray-500 hover:bg-gray-600',
      focused: 'bg-black text-white hover:bg-gray-600',
      dot: 'flex items-center before:bg-black before:border before:border-white before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    }
  };

  // Fallback for unknown levels
  const defaultMapping = {
    default: 'text-gray-500',
    focused: 'bg-gray-500 text-white',
    dot: ''
  };

  // Get the specific mapping for the level or fallback if level is not recognized
  const dificultyMapping = colorMapping[level] || defaultMapping;

  // Return the class names based on the state
  return dificultyMapping[state];
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
  multiValue: ({data}: {data: any}) => [
    getSelectColorForDifficulty(data.value, 'focused'), // Bg color of the chips
    'rounded-sm',
    'm-0.5']
    .join(' '),
  multiValueLabel: ({data}: { data: any }) =>
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