export function StatsPlaceHolder() {
  return (
    <div className="animate-pulse flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-24"></div>
          </div>
          <div className="w-16 h-16 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-8"></div>
        </div>
        ))}
      </div>
    </div>
  );
}