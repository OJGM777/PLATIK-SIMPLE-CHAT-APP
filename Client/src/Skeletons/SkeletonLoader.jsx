const SkeletonLoader = () => {
  return (
    <ul className="space-y-2">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <li
            key={index}
            className="mb-2 flex w-full dark:bg-gray-800 p-3 rounded-lg bg-gray-500 items-center gap-3 animate-pulse"
          >
            <div className="w-8 h-8 rounded-full dark:bg-gray-700 bg-gray-400 "></div>
            <div className="flex-1">
              <div className="h-4 dark:bg-gray-700 bg-gray-400  rounded w-1/2 mb-1"></div>
              <div className="h-3 dark:bg-gray-700  bg-gray-400 rounded w-1/3"></div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default SkeletonLoader
