export function RankingPlaceholder() {
  return (
    <div className="animate-pulse flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between space-x-4 h-[70px]">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 mr-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-24 sm:w-40"></div>
          </div>
          <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-8"></div>
        </div>
        ))}
      </div>
    </div>
  );
}