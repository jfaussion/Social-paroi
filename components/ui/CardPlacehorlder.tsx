export function CardPlaceHolder() {
  return (
    <div className="animate-pulse flex flex-col gap-4 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
        </div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-3 bg-gray-400 dark:bg-gray-500 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-3 bg-gray-400 dark:bg-gray-500 rounded"></div>
              <div className="col-span-1 h-3 bg-gray-400 dark:bg-gray-500 rounded"></div>
            </div>
            <div className="h-3 bg-gray-400 dark:bg-gray-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}