export const getBorderColor = (color: string): string => {
  const borderColorMapping: { [color: string]: string } = {
    Unknown: 'border-gray-500',
    White: 'border-white',
    Green: 'border-green-500',
    Blue: 'border-blue-500',
    Pink: 'border-pink-500',
    Red: 'border-red-500',
    Yellow: 'border-yellow-500',
    Purple: 'border-purple-500',
    Orange: 'border-orange-500',
    Black: 'border-black',
  };

  return borderColorMapping[color] ?? 'border-gray-500';
};

export const getBgColor = (color: string): string => {
  const bgColorMapping: { [K: string]: string } = {
    Unknown: 'bg-gray-500',
    White: 'bg-white border dark:border-none border-black',
    Green: 'bg-green-500',
    Blue: 'bg-blue-500',
    Pink: 'bg-pink-500',
    Red: 'bg-red-500',
    Yellow: 'bg-yellow-500',
    Purple: 'bg-purple-500',
    Orange: 'bg-orange-500',
    Black: 'bg-black dark:border dark:border-white',
  };
  return bgColorMapping[color] ?? 'border-gray-500';
};


/**
 * Utility for react select
 */
export const getSelectColor = (level: string, state: 'default' | 'focused' | 'dot'): string => {
  const colorMapping: { [key: string]: { default: string, focused: string, dot: string } } = {
    Unknown: {
      default: 'text-gray-500',
      focused: 'bg-gray-500 text-white',
      dot: 'flex items-center before:bg-gray-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    White: {
      default: 'text-black dark:text-gray-500',
      focused: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      dot: 'flex items-center before:bg-gray-100 before:border before:border-black before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Green: {
      default: 'text-green-400 hover:bg-green-600 hover:text-white',
      focused: 'bg-green-500 dark:bg-green-800 text-white hover:bg-green-600',
      dot: 'flex items-center before:bg-green-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Blue: {
      default: 'text-blue-400 hover:bg-blue-600 hover:text-white',
      focused: 'bg-blue-500 dark:bg-blue-800 text-white hover:bg-blue-600',
      dot: 'flex items-center before:bg-blue-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Pink: {
      default: 'text-pink-400 hover:bg-pink-600 hover:text-white',
      focused: 'bg-pink-500 dark:bg-pink-800 text-white hover:bg-pink-600',
      dot: 'flex items-center before:bg-pink-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Red: {
      default: 'text-red-400 hover:bg-red-600 hover:text-white',
      focused: 'bg-red-600 dark:bg-red-800 text-white hover:bg-red-600',
      dot: 'flex items-center before:bg-red-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Yellow: {
      default: 'text-yellow-400 hover:bg-yellow-600 hover:text-white',
      focused: 'bg-yellow-600 dark:bg-yellow-800 text-white hover:bg-yellow-600',
      dot: 'flex items-center before:bg-yellow-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Purple: {
      default: 'text-purple-400 hover:bg-purple-600 hover:text-white',
      focused: 'bg-purple-600 dark:bg-purple-800 text-white hover:bg-purple-600',
      dot: 'flex items-center before:bg-purple-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Orange: {
      default: 'text-orange-400 hover:bg-orange-600 hover:text-white',
      focused: 'bg-orange-600 dark:bg-orange-800 text-white hover:bg-orange-600',
      dot: 'flex items-center before:bg-orange-500 before:rounded-full before:block before:mr-2 before:h-3 before:w-3'
    },
    Black: {
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
  const selectMapping = colorMapping[level] || defaultMapping;

  // Return the class names based on the state
  return selectMapping[state];
};