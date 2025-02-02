export function CardPlaceHolder() {
  return (
    <div className="animate-pulse flex items-stretch bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg overflow-hidden relative">
      {/* Left-side image placeholder */}
      <div className="w-1/3 h-28 bg-gray-400 dark:bg-gray-500"></div>

      {/* Right-side content placeholder */}
      <div className="w-2/3 flex flex-col justify-between p-4">
        {/* Title placeholder */}
        <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-3/4"></div>

        {/* Additional info placeholders */}
        <div className="flex justify-between items-center mt-2">
          <div className="h-10 w-16 bg-gray-400 dark:bg-gray-500 rounded"></div>
          <div className="h-10 w-10 bg-gray-400 dark:bg-gray-500 rounded-full "></div>
        </div>
      </div>

      {/* Right border for difficulty color (placeholder effect) */}
      <div className="absolute right-0 top-0 h-full w-2 bg-gray-500 dark:bg-gray-600"></div>
    </div>
  );
}
