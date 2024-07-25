export function NewsPlaceHolder() {
  return (
    <div className="animate-pulse flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <h2 className="h-5 bg-gray-400 w-[50%] dark:bg-gray-500 rounded"></h2>
          <div className="space-y-3">
            <div className="h-3 bg-gray-400 w-[66%] dark:bg-gray-500 rounded"></div>
            <div className="h-3 bg-gray-400 dark:bg-gray-500 rounded"></div>
            <div className="h-3 bg-gray-400 w-[66%] dark:bg-gray-500 rounded"></div>
            <div className="h-3 bg-gray-400 w-[25%] dark:bg-gray-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}