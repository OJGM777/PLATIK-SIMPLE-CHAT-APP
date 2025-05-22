import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../API/usersCalls.js";
import { formatDate } from "../utilities/formatDate.js";
import UserInfoSkeletonLoader from "../Skeletons/UserInfoSkeletonLoader.jsx";
import { useSelector } from "react-redux";
import OriginalSizePicture from "../Widgets/OriginalSizePicture.jsx";

const ProfileInfo = ({ closeVar, id }) => {
  const [userInfo, setUserInfo] = useState(null);
  const Token = useSelector((state) => state.tokenInfo);
  const fontSize = useSelector((state) => state.fontSize);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // CONTROLS THE SKELETON LOADER
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser(id, Token); // FETCHS THE USER DATA
        setUserInfo(userData); // UPDATES THE STATE
      } catch (error) {
        console.error("No data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, Token]);

  if (isLoading) {
    return <UserInfoSkeletonLoader />;
  }

  if (userInfo && "error" in userInfo) {
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center flex-col bg-black bg-opacity-50">
        <div className="dark:bg-gray-900 bg-gray-50 text-black rounded-lg shadow-lg p-6 w-[60%] relative">
          <h2 className="text-red-500 text-xl font-bold">
            Error: No user data available
          </h2>
          <div className="mt-4 flex justify-center">
            <button
              className="bg-purple-500 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => closeVar(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <>
      {showFullImage && (
        <OriginalSizePicture
          src={userInfo.ProfilePicture}
          setter={setShowFullImage}
        />
      )}
      {showFullDescription && (
        <>
          {/* Fondo oscuro */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>

          <div
            onClick={(e) => {
              setShowFullDescription(false);
              e.stopPropagation();
            }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div
              className="bg-gray-300 dark:bg-gray-800 dark:text-gray-100 text-black max-h-[500px] w-[80%] h-[50%] p-4 overflow-auto rounded-lg shadow-lg"
              // Previene cierre al hacer clic dentro
            >
              <p>{userInfo.about}</p>
            </div>
          </div>
        </>
      )}
      <div
        className={`fixed ${fontSize} inset-0 z-40 flex  items-center justify-center flex-col bg-black bg-opacity-50`}
      >
        <div className="dark:bg-gray-900  bg-gray-50 text-black rounded-lg shadow-lg p-6 w-[60%] max-md:w-[99%] max-md:max-h-[70%] max-h-[85%] relative">
          {/* BUTTON TO CLOSE WINDOW */}
          <button
            className="absolute top-2 right-5 flex gap-[2px] rounded-full p-2 w-8 h-8 items-center flex-col dark:text-gray-400 text-2xl hover:text-gray-600"
            onClick={() => closeVar(false)}
          ></button>

          {/* MODAL */}
          <div
            onClick={() => setShowFullImage(true)}
            className="flex cursor-pointer justify-center mb-4"
          >
            <img
              src={userInfo.ProfilePicture}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full border-2 border-gray-300"
            />
          </div>

          {/* INFO */}
          <div className="text-left dark:text-white flex flex-col gap-3">
            <h2 className={`font-bold mb-4 text-2xl`}>{userInfo.name}</h2>
            {userInfo.about && (
              <span
                onClick={() => {
                  if (userInfo.about.length < 250) {
                    return;
                  }
                  console.log("WTF");
                  setShowFullDescription(true);
                }}
                className="flex flex-col cursor-pointer dark:text-white bg-gray-300 dark:bg-gray-800 rounded p-2 gap-2"
              >
                <p className="dark:text-gray-100 font-bold">About Me</p>
                <p className="line-clamp-3">{userInfo.about}</p>
              </span>
            )}
            <span className="flex dark:text-white flex-col bg-gray-300 dark:bg-gray-800 rounded p-2 gap-2">
              <p className="dark:text-gray-100 font-bold">Member Since</p>
              <p>{formatDate(userInfo.Created)}</p>
            </span>
            <p className="text-gray-600">Email:</p>
            <p className="text-blue-600">{userInfo.email}</p>
          </div>

          {/* CLOSE BUTTON */}
          <div className="mt-6 flex justify-center">
            <button
              className="bg-purple-500 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => closeVar(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
