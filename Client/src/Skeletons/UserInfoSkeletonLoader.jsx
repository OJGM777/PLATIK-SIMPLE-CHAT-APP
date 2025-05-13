const UserInfoSkeletonLoader = () => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="dark:bg-gray-900 bg-gray-50 rounded-lg shadow-lg p-6 w-[60%] max-md:w-[99%] relative ">
        {/* Botón para cerrar ventana */}
        <button className="absolute top-2 right-5 flex gap-[2px] rounded-full p-2 w-8 h-8 items-center flex-col bg-gray-500  dark:bg-gray-800">
          <span className="block w-1 h-1  bg-gray-300 dark:bg-gray-700 rounded-full"></span>
          <span className="block w-1 h-1  bg-gray-300 dark:bg-gray-700 rounded-full"></span>
          <span className="block w-1 h-1  bg-gray-300 dark:bg-gray-700 rounded-full"></span>
        </button>

        {/* Contenido del modal */}
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28  bg-gray-300 dark:bg-gray-700 rounded-full border-2 dark:border-gray-800"></div>
        </div>

        {/* Información */}
        <div className="text-left dark:text-white flex flex-col gap-3">
          <div className="h-6  bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>

          <div className="flex flex-col bg-gray-400 dark:bg-gray-800 rounded p-2 gap-2">
            <div className="h-8  bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8  bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          </div>

          <div className="flex flex-col bg-gray-400 dark:bg-gray-800 rounded p-2 gap-2">
            <div className="h-8  bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8  bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          <div className="h-4  bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-3  bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
        </div>

        {/* Botón de cierre */}
        <div className="mt-6 flex justify-center">
          <div className="w-20 h-8  bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoSkeletonLoader;
