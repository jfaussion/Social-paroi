const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgb(31, 41, 55)', // Tailwind's 'bg-gray-800'
    borderColor: 'rgb(75, 85, 99)', // Tailwind's 'border-gray-600'
    color: 'white',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgb(156, 163, 175)', // Tailwind's 'border-gray-400'
    }
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgb(55, 65, 81)', // Tailwind's 'bg-gray-700'
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: 'rgb(156, 163, 175)', // Tailwind's 'text-gray-400'
    '&:hover': {
      backgroundColor: 'rgb(107, 114, 128)', // Tailwind's 'bg-gray-600'
      color: 'white',
    },
  }),
  option: (provided: any, state: { isSelected: boolean, isFocused: boolean }) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'rgb(31, 41, 55)' // Tailwind's 'bg-gray-800' for selected options
      : state.isFocused
      ? 'rgb(55, 65, 81)' // Tailwind's 'bg-gray-700' for focused options
      : 'rgb(17, 24, 39)', // Tailwind's 'bg-gray-900' for default option background
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(75, 85, 99)', // Tailwind's 'bg-gray-600'
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'rgb(156, 163, 175)', // Tailwind's 'text-gray-400'
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    color: 'rgb(156, 163, 175)', // Tailwind's 'text-gray-400'
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgb(17, 24, 39)', // Tailwind's 'bg-gray-900', match this with your options' default background
    borderColor: 'rgb(31, 41, 55)', // Optionally, set a border color that matches your theme
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', // Tailwind's boxShadow for consistency
  }),
};

export default customStyles;