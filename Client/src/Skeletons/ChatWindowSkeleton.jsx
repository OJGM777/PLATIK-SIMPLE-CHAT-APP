import React from "react";

const ChatWindowSkeleton = () => {
  return (
    <div className="flex-1 max-lg:fixed z-20 text-white max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:h-screen dark:bg-gray-800 bg-slate-50 p-4 flex flex-col">
      {/* Chat Header Skeleton */}
      <div className="flex items-center justify-between dark:bg-gray-900 bg-gray-400 border dark:border-none dark:text-white text-black rounded-lg p-3 mb-4">
        <div className="flex dark:hover:bg-gray-800 hover:bg-gray-600 p-2 rounded-md items-center gap-3">
          <div className="w-20 h-20 bg-gray-600 rounded-full animate-pulse"></div>
          <div>
            <div className="w-36 h-6 bg-gray-600 rounded-md animate-pulse mb-2"></div>
            <div className="w-24 h-4 bg-gray-600 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Chat Messages Skeleton */}
      <div className="flex-1 flex flex-col max-h-[500px] max-md:max-h-[90vh] overflow-y-auto p-4 gap-3 text-black">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="w-24 h-4 bg-gray-600 rounded-md animate-pulse mb-2"></div>
              <div className="w-full h-6 bg-gray-600 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Skeleton */}
      <div className="pt-2 flex items-center gap-2">
        <div className="flex-1 h-10 bg-gray-600 rounded-md animate-pulse"></div>
        <div className="w-24 h-10 bg-purple-600 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default ChatWindowSkeleton;