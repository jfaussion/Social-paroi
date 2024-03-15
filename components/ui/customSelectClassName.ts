const customSelectClassName = {
  clearIndicator: ({ isFocused }: { isFocused: boolean }) =>
    [
      isFocused ? 'text-neutral-600' : 'text-neutral-200',
      'p-2',
      isFocused ? 'hover:text-neutral-800' : 'hover:text-neutral-400'
    ].join(' '),
  control: ({ isDisabled, isFocused }: { isDisabled: boolean, isFocused: boolean }) =>
    [
      isDisabled ? 'bg-neutral-50' : 'bg-gray-800',
      isDisabled
        ? 'border-neutral-100'
        : isFocused
          ? 'border-gray-600'
          : 'border-gray-600',
      'rounded',
      'border-solid',
      'border',
      isFocused && 'shadow-[0_0_0_1px] shadow-gray-800',
      isFocused ? 'hover:border-gray-300' : 'hover:border-gray-400'
    ].join(' '),
  dropdownIndicator: ({ isFocused }: { isFocused: boolean }) =>
    [isFocused ? 'text-neutral-600' : 'text-neutral-200',
      'p-2',
    isFocused ? 'hover:text-neutral-800' : 'hover:text-neutral-400'
    ].join(' '), group: () => 'py-2',
  groupHeading: () =>
    [
      'text-neutral-400',
      'text-xs',
      'font-medium',
      'mb-1',
      'px-3',
      'uppercase'
    ].join(' '),
  indicatorSeparator: ({ isDisabled }: { isDisabled: boolean }) => [
    isDisabled ? 'bg-neutral-100' : 'bg-neutral-200',
    'my-2'
  ].join(' '),
  input: () => [
    'm-0.5', 'py-0.5', 'text-neutral-800'
  ].join(' '),
  loadingIndicator: ({ isFocused }: { isFocused: boolean }) =>
    [
      isFocused ? 'text-neutral-600' : 'text-neutral-200',
      'p-2'
    ].join(' '),
  loadingMessage: () => ['text-neutral-400', 'py-2', 'px-3'].join(' '),
  menu: () =>
    [
      'bg-gray-900',
      'rounded',
      'shadow-[0_0_0_1px_rgba(0,0,0,0.1)]',
      'my-1'
    ].join(' '),
  menuList: () => 'py-1',
  multiValue: () => [
    'bg-gray-700', // Bg color of the chips
    'rounded-sm',
    'm-0.5']
    .join(' '),
  multiValueLabel: () =>
    ['rounded-sm',
      'text-white', // Couleur du text des chips
      'text-sm',
      'p-[3px]',
      'pl-[6px]'
    ].join(' '),
  multiValueRemove: ({ isFocused }: { isFocused: boolean }) =>
    [
      'rounded-sm',
      'text-gray-400',
      isFocused && 'bg-gray-600',
      'px-1',
      'hover:bg-gray-500',
      'hover:text-white'
    ].join(' '),
  noOptionsMessage: () =>
    ['text-neutral-400', 'py-2', 'px-3'].join(' '),
  option: ({ isDisabled, isFocused, isSelected }: { isDisabled: boolean, isFocused: boolean, isSelected: boolean }) => [
    isFocused
        ? 'bg-gray-700' // bg color focused
        : 'bg-gray-900', // bg color default
    isDisabled
      ? 'text-neutral-800'
      : isSelected
        ? 'text-white'
        : 'text-inherit',
    'hover:bg-gray-600', // hover bg color
    'py-2',
    'px-3',
    !isDisabled &&
    (isSelected ? 'active:bg-gray-800' : 'active:bg-gray-500')
  ].join(' '),
  placeholder: () => 'text-gray-400 mx-0.5',
  singleValue: ({ isDisabled }: { isDisabled: boolean }) => [
    isDisabled ? 'text-neutral-400' : 'text-neutral-800',
    'mx-0.5'
  ].join(' '), valueContainer: () => ['py-0.5', 'px-2'].join(' '),
}

export default customSelectClassName;