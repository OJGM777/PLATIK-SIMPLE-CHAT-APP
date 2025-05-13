const NotificationsSkeleton = () => {
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center flex-col bg-black bg-opacity-50">
        <div className="fixed z-30 max-w-[40%]  max-md:max-w-[85%] max-md:max-h-[75%] max-md:top-[10%] rounded-lg inset-2 mx-auto p-6 dark:bg-gray-900 bg-gray-300 dark:text-white text-white">
          <h1 className="text-2xl font-bold mb-4 dark:text-white text-black">Notifications</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="dark:bg-gray-800 bg-gray-400 rounded-lg p-2 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-500 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-500 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-500 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="ml-auto h-3 w-10 bg-gray-500 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default NotificationsSkeleton;