import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUser } from "../API/SearchCalls.js";
import UserComponent from "./UserComponent.jsx";
import SkeletonLoader from "../Skeletons/SkeletonLoader.jsx";
import { useSelector } from "react-redux";
import LoadScreen from "./LoadScreen.jsx";
import ProfileInfo from "./ProfileInfo.jsx";

const SearchWindow = ({ closeWindow }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null); //
  const [isLoading, setIsLoading] = useState(false);
  const [towait, setTowait] = useState(false);
  const [userIdToShowProfile, setUserIdToShowProfile] = useState(null);
  const userProfile = useSelector((state) => state.userInfo);
  const Token = useSelector((state) => state.tokenInfo);
  const fontSize = useSelector((state) => state.fontSize);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 3) return;

    setIsLoading(true); // Mostrar skeleton loader
    try {
      const userResults = await searchUser(searchTerm, Token);
      setResults(userResults);
    } catch (error) {
      console.log("Error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {towait && <LoadScreen />}
      {userIdToShowProfile && (
        <ProfileInfo
          id={userIdToShowProfile}
          closeVar={() => setUserIdToShowProfile(null)}
        />
      )}
      <div
        onClick={() => closeWindow(false)}
        className={`fixed inset-0 flex items-center  justify-center bg-black bg-opacity-50 z-30 ${fontSize}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-30 w-full overflow-y-hidden max-w-2xl mx-4 max-h-[80vh] md:max-h-[70vh] rounded-lg dark:bg-gray-900 bg-gray-50 text-white p-4 md:p-6"
        >
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-purple-500">
              Search
            </h1>
            <p className={`dark:text-gray-400 text-black text-sm ${fontSize}`}>
              Search An User
            </p>
          </div>

          {/* Input de búsqueda */}
          <div className="flex flex-col md:flex-row gap-2 mb-4 md:mb-6">
            <input
              type="text"
              className="flex-grow p-2 md:p-3 rounded-md dark:bg-gray-800 dark:text-gray-200 bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search by Email (at least 3 Characters)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 md:py-3 bg-purple-500 rounded-md hover:bg-purple-600 transition text-sm font-semibold whitespace-nowrap"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>

          {/* Resultados */}
          <div className="dark:bg-gray-700 bg-gray-300 min-h-[200px] max-h-[50vh] md:max-h-[55vh] overflow-auto rounded-md p-3 md:p-4">
            <h2 className="text-base md:text-lg font-medium mb-2 text-black dark:text-gray-300">
              Results
            </h2>
            {isLoading ? (
              <SkeletonLoader />
            ) : results?.length > 0 ? (
              <ul className="space-y-2">
                {results.map((user, index) => (
                  <UserComponent
                    key={index}
                    user={user}
                    userIdVar={setUserIdToShowProfile}
                    waitVar={setTowait}
                    userProfile={userProfile}
                    closeSearchWindowvar={closeWindow}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-[100px]">
                <p className="text-gray-400 text-center">
                  Nobody is Here <br />
                  :(
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchWindow;
