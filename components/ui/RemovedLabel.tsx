interface RemovedLabelProps {
  color?: 'red' | 'default';
}

const RemovedLabel = ({ color }: RemovedLabelProps) => {

  const customColorClass = color === 'red' ? 
      "border-red-600 dark:border-red-400 text-red-600 dark:text-red-400"
    : "border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400"

  return (
    <span className={`inline-flex items-center text-xs font-semibold pr-2 p-1 rounded border ${customColorClass}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>Removed
    </span>
  );
}

export default RemovedLabel;