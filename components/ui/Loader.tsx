interface LoaderProps {
  isLoading: boolean;
  text?: string;
}

const Loader = ({ isLoading, text }: LoaderProps) => {

  const loadingText = text || 'Loading...';

  return (
    isLoading && (
      <div>
        <div className="flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 m-3 border-t-4 border-l-4 border-gray-900 dark:border-gray-100"></div>
          <h1 className="animate-pulse text-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900">{loadingText}</h1>
        </div>
      </div>
    )
  );
}

export default Loader;