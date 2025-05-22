import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteEntireUser, updateUserInfo } from "../API/usersCalls.js";
import { setLogin, setLogOut } from "../store/chatSlice.js";
import LoadScreen from "../Components/LoadScreen.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import { useNavigate } from "react-router-dom";
import { verifySize } from "../utilities/verifyImageSize.js";

const UserInfoUpdate = () => {
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.userInfo);
  const token = useSelector((state) => state.tokenInfo);
  const fontSize = useSelector((state) => state.fontSize);
  const [name, setName] = useState(user.name || "");
  const [about, setAbout] = useState(user.about || "");
  const [toWait, setToWait] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [toUpdate, setToUpdate] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setToUpdate(true);
    const file = event.target.files[0];
    if (file) {
      const verifyingSize = verifySize(file, 5);

      if(!verifyingSize){
        setNewProfilePicture(null);
        return alert("File must not exceed the 5MB")
      }
      setNewProfilePicture(file);

    }
  };

  const handleUpdate = async () => {
    setToWait(true);
    try {
      const result = await updateUserInfo(
        user.id,
        name,
        about,
        newProfilePicture,
        user.ProfilePicture,
        token
      );
      console.log(result);
      if (!result.success) return { error: "User not found" };
      dispatch(setLogin({ userInfo: result.user, tokenInfo: token }));
      console.log("CURRENT USER INFO: ", user);
    } catch (error) {
      console.log(error);
    } finally {
      setToWait(false);
      setToUpdate(false);
    }
  };

  const handleLogOut = () => {
    dispatch(setLogOut());
  };

  const [danger, setDanger] = useState(false);
  const [userManagement, setUserManagement] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDeleteUser = async (userId, token) => {
    const result = await deleteEntireUser(userId, token);
    if (!result.deleted) {
      return alert("SOMETHING WENT WRONG");
    }
    dispatch(setLogOut());
    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      {toWait && <LoadScreen />}
      <div>
        <br />
        <form className="gap-1 flex flex-col">

          <div className="flex items-center gap-3 w-[120px] m-auto cursor-pointer justify-center mb-4 relative group">
            <div className="relative w-28 h-28">
              <img
                src={user.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300 cursor-pointer"
                onClick={handleImageClick} //ACTIVATES THE INPUT WHEN THE USER CLICKS THE IMAGE
              />
              <div
                onClick={handleImageClick}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-white font-bold text-sm">EDIT</span>
              </div>
            </div>
            <hr />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          {/* //// */}
          <label htmlFor="name">Name:</label>
          <input
            className=" p-[3px] border border-gray-600 rounded-md dark:bg-gray-800  bg-gray-200 dark:text-gray-100"
            type="text"
            id="name"
            name="name"
            maxLength={"30"}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              setToUpdate(true);
            }}
            value={name}
            required
          />
          <br />
          <label htmlFor="about">About:</label>
          <textarea
            maxLength={300}
            onKeyDown={(e) => setToUpdate(true)}
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="p-[3px] border border-gray-600 rounded-md dark:bg-gray-800 bg-gray-200 dark:text-gray-100 min-h-[100px] max-h-[240px]"
            name="About"
            id="aboutArea"
          />

          <div
            className={`mt-6 ${
              toUpdate ? "block" : "hidden"
            } flex justify-center`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="bg-purple-500 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
          <br />
          <br />
          <hr />
          <div className="flex flex-col justify-center items-center mt-3 gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setUserManagement(!userManagement);
              }}
              className={`${fontSize} text-left p-2 flex justify-between cursor-pointer  rounded-lg bg-slate-300 dark:bg-slate-800 w-full text-black dark:text-white`}
            >
              <p>User Management</p>
              <p>{userManagement ? "↑" : "↓"}</p>
            </button>
            {userManagement && (
              <div className="flex flex-col m-auto justify-center w-full gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogOut();
                  }}
                  className="bg-red-600 m-auto hover:bg-gray-300 text-white w-[40%] px-4 py-2 rounded"
                >
                  LOG OUT
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDanger(!danger);
                  }}
                  className="bg-red-600 m-auto hover:bg-gray-300 text-white w-[40%] px-4 py-2 rounded"
                >
                  DANGER
                </button>
                {danger && (
                  <div className="bg-red-800 bg-opacity-15 p-2 ">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmationModal(true);
                      }}
                      className={`font-bold  rounded-lg  text-red-600 hover:text-white ${fontSize}`}
                    >
                      DELETE PROFILE
                    </button>
                    <p
                      className={`dark:text-gray-400 text-gray-900 ${fontSize}`}
                    >
                      This action is irreversible, Do it at your Own Risk, THIS
                      WILL INCLUDE:
                    </p>
                    <ul>
                      <li>ALL YOUR MESSAGES HISTORY</li>
                      <li>ALL YOUR RELATIONS WITH YOUR CHATS</li>
                      <li>YOUR GENERAL INFORMATION</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            <ConfirmationModal
              isOpen={showConfirmationModal}
              onConfirm={(e) => {
                e.preventDefault();
                handleDeleteUser(user.id, token);
                setShowConfirmationModal(false); // IMPLEMENT THE LOGIC TO THE FRONT-END TO DELETE AN USER.
              }}
              onClose={() => setShowConfirmationModal(false)}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UserInfoUpdate;
