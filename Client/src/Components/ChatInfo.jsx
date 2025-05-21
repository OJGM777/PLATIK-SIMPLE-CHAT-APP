import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadScreen from "./LoadScreen.jsx";
import AddUser from "../Widgets/AddUser.jsx";
import OriginalSizePicture from "../Widgets/OriginalSizePicture.jsx";
import ConfirmationModal from "../Widgets/ConfirmationModal.jsx";
import { socket } from "../API/SOCKET_IO.js";
import {
  handleAddUserToGroup,
  handleMuteChat,
  handleRemoveUsersFromGroup,
  handleUnMuteChat,
} from "../handlers/chatHandlers.js";
import MemberComponent from "./MemberComponent.jsx";
import { verifySize } from "../utilities/verifyImageSize.js";
import { handleDeleteEntireChat, handleEmptyMessagesFromChat, handleUpdate } from "../handlers/chatInfoHandlers.js";


const ChatInfo = ({ closeVar, image }) => {
  const fileInputRef = useRef(null);
  const activeChat = useSelector((state) => state.activeChat);
  const userProfile = useSelector((state) => state.userInfo);
  const token = useSelector((state) => state.tokenInfo);
  const mutedChats = useSelector((state) => state.mutedChats);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("tab1");
  const [openProfileId, setOpenProfileId] = useState(null);
  const [toWait, setToWait] = useState(false);
  const fontSize = useSelector((state) => state.fontSize);

  // chat data
  const [profilePicture, setProfilePicture] = useState(
    activeChat?.data?.isGroupChat ? activeChat?.data?.ChatImage : image
  );
  const [chatName, setChatName] = useState(
    activeChat?.data?.ChatName || "Chat Name"
  );
  const [description, setDescription] = useState(
    activeChat?.data?.description || "No description available"
  );
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [toUpdate, setToUpdate] = useState(false);
  const [newUsers, setNewUsers] = useState([]);
  const [isAddingVisible, setIsAddingVisible] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const isChatMuted = mutedChats.some((chat) => chat.id === activeChat.data.id);

  const handleImageClick = () => {
    if (
      activeChat?.data?.ChatAdmin === userProfile.id &&
      activeChat?.data?.isGroupChat
    ) {
      fileInputRef.current.click();
    } else {
      return;
    }
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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [typeOfConfirmation, setTypeOfConfirmation] = useState("");

  useEffect(() => {
    setProfilePicture(
      activeChat?.data?.isGroupChat ? activeChat?.data?.ChatImage : image
    );
  }, [activeChat]);

  return (
    <>
      {showFullImage && (
        <OriginalSizePicture src={profilePicture} setter={setShowFullImage} />
      )}

      {toWait && <LoadScreen />}
      <div
        onClick={() => closeVar(false)}
        className="fixed inset-0 z-30 flex items-center justify-center flex-col bg-black bg-opacity-40"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-md:flex-col h-[85vh] w-[60vw] max-md:w-[98vw] p-2 rounded-md dark:bg-gray-900 bg-gray-100 text-black dark:text-gray-200"
        >
          <div className="min-w-[25%] border-r border-gray-700 flex flex-col max-md:flex-row items-start max-md:items-center p-4 max-md:justify-center">
            <ul className="w-full flex flex-col space-y-4 max-md:space-y-0 max-md:space-x-4 max-md:flex-row max-md:justify-center">
              <li
                onClick={() => setActiveTab("tab1")}
                className={`${
                  activeTab === "tab1"
                    ? "text-white bg-gray-400 dark:bg-gray-800"
                    : "dark:hover:text-white hover:bg-gray-400 hover:text-white dark:text-white text-black dark:hover:bg-gray-800"
                } p-2 w-full max-md:w-auto text-center rounded-lg cursor-pointer ${fontSize}`}
              >
                Resume
              </li>
              <li
                onClick={() => setActiveTab("tab2")}
                className={`${
                  activeTab === "tab2"
                    ? "text-white bg-gray-400 dark:bg-gray-800"
                    : "dark:hover:text-white hover:bg-gray-400 hover:text-white dark:text-white text-black dark:hover:bg-gray-800"
                } p-2 w-full max-md:w-auto text-center rounded-lg cursor-pointer ${fontSize}`}
              >
                Members
              </li>
              {activeChat?.data?.ChatAdmin === userProfile.id && (
                <li
                  onClick={() => setActiveTab("tab3")}
                  className={`${
                    activeTab === "tab3"
                      ? "text-white bg-gray-400 dark:bg-gray-800"
                      : "dark:hover:text-white hover:bg-gray-400 hover:text-white dark:text-white text-black dark:hover:bg-gray-800"
                  } p-2 w-full max-md:w-auto text-center rounded-lg cursor-pointer ${fontSize}`}
                >
                  Management
                </li>
              )}
            </ul>
          </div>

          <div className="flex-grow overflow-auto p-6">
            {activeTab === "tab1" && (
              <div>
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="flex items-center gap-3 w-[120px] m-auto cursor-pointer justify-center mb-4 relative group">
                    <div
                      onClick={() => setShowFullImage(true)}
                      className="relative cursor-pointer w-28 h-28"
                    >
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full border-2 border-gray-300 cursor-pointer"
                        onClick={handleImageClick}
                      />
                      {activeChat?.data?.ChatAdmin === userProfile.id &&
                      activeChat?.data?.isGroupChat ? (
                        <div
                          onClick={handleImageClick}
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <span className="text-white font-bold text-sm">
                            EDIT
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    {activeChat?.data?.ChatAdmin === userProfile.id &&
                    activeChat?.data?.isGroupChat ? (
                      <input
                        onChange={(e) => {
                          setChatName(e.target.value);
                          setToUpdate(true);
                        }}
                        value={chatName}
                        className="text-2xl dark:bg-gray-800 p-2 text-center rounded dark:text-gray-100 text-black font-semibold"
                      />
                    ) : (
                      <h3 className="text-2xl dark:text-gray-100 text-black font-semibold">
                        {chatName || "Chat Name"}
                      </h3>
                    )}
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-4">
                  <div>
                    <h4
                      className={`font-bold dark:text-gray-300 text-black ${fontSize}`}
                    >
                      Description
                    </h4>
                    <div>
                      {activeChat?.data?.ChatAdmin === userProfile.id &&
                      activeChat?.data?.isGroupChat ? (
                        <textarea
                          onChange={(e) => {
                            setDescription(e.target.value);
                            setToUpdate(true);
                          }}
                          value={description}
                          className="resize-none font-bold w-[80%] dark:text-gray-300 text-black  dark:bg-gray-800 p-2 rounded-md"
                        />
                      ) : (
                        <p className="dark:text-gray-400 text-gray-900">
                          {description || "No description available"}
                        </p>
                      )}
                    </div>
                    <div
                      className={`mt-6 ${
                        toUpdate &&
                        activeChat?.data?.ChatAdmin === userProfile.id
                          ? "block"
                          : "hidden"
                      } flex justify-center`}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdate(setToWait, activeChat, chatName, description, newProfilePicture, profilePicture, token, dispatch, setToUpdate, userProfile);
                        }}
                        className="bg-purple-500 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4
                      className={`font-bold dark:text-gray-300 text-black ${fontSize}`}
                    >
                      Number of Members
                    </h4>
                    <p
                      className={`dark:text-gray-400 text-gray-900 ${fontSize}`}
                    >
                      {activeChat?.users?.length || 0} Members
                    </p>
                  </div>
                  <div>
                    <h4
                      className={`font-bold dark:text-gray-300 text-black ${fontSize}`}
                    >
                      Created at:
                    </h4>
                    <p
                      className={`dark:text-gray-400 text-gray-900 ${fontSize}`}
                    >
                      {activeChat?.data?.Created
                        ? new Date(activeChat.data.Created).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* SIGUE CON LA FUNCION DE AÑADIR MIEMBROS !!!!!!!!!!!!!!!! */}
            {activeTab === "tab2" && (
              <div>
                <h3 className="text-xl font-bold mb-4 overflow-auto">
                  Members
                </h3>
                {activeChat?.data?.ChatAdmin === userProfile.id &&
                activeChat?.data?.isGroupChat ? (
                  <div className="flex gap-2 items-center mb-6">
                    <div className="w-full">
                      <span
                        className={`w-full ${
                          isAddingVisible ? "bg-purple-800 text-white" : ""
                        } dark:bg-gray-800 p-2 bg-gray-300 hover:bg-purple-500 rounded-lg cursor-pointer ${fontSize}`}
                        onClick={() => setIsAddingVisible(!isAddingVisible)}
                      >
                        Add More Members
                      </span>
                      {isAddingVisible && (
                        <div className="flex max-w-full flex-col gap-2 items-center mt-4">
                          <AddUser userAdder={setNewUsers} toAddMoreUsers={true} />
                          <button
                            className={`px-4 py-3 w-[50%] bg-purple-500 rounded-md hover:bg-purple-600 transition text-sm font-semibold`}
                            onClick={() =>
                              handleAddUserToGroup(
                                newUsers,
                                activeChat,
                                setToWait,
                                setIsAddingVisible,
                                setNewUsers,
                                token,
                                dispatch
                              )
                            }
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => {
                      console.log(mutedChats);
                      if (isChatMuted) {
                        return handleUnMuteChat(activeChat.data, dispatch);
                      } else {
                        return handleMuteChat(
                          activeChat.data,
                          profilePicture,
                          dispatch
                        );
                      }
                    }}
                    className={`${
                      isChatMuted ? "bg-gray-800" : "bg-red-500"
                    } text-white hover:text-red-500 hover:bg-gray-50 p-2 rounded-lg`}
                  >
                    {isChatMuted ? "Unmute Chat" : "Mute Chat"}
                  </button>
                  {activeChat?.data.ChatAdmin !== userProfile.id && (
                    <button
                      onClick={() => {
                        setShowConfirmationModal(true);
                        setTypeOfConfirmation("LEAVE_CHAT");
                      }}
                      className="bg-red-500 text-white hover:text-red-500 hover:bg-gray-50 p-2 rounded-lg"
                    >
                      Leave Chat
                    </button>
                  )}
                </div>

                <ul className="space-y-2 ">
                  {activeChat?.users?.map((user) => (
                    <MemberComponent
                      key={user.UserId}
                      memberUser={user}
                      openVar={openProfileId === user.UserId}
                      closeProfileVar={(id) => setOpenProfileId(id)}
                      closeInfo={closeVar}
                      image={user.ProfilePicture}
                      name={user.name}
                      profileId={userProfile.id}
                      Id={user.UserId}
                      dispatch={dispatch}
                      waitVar={setToWait}
                    />
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "tab3" &&
              activeChat?.data?.ChatAdmin === userProfile.id && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold mb-4 overflow-auto">
                    Management
                  </h3>
                  <div className="bg-red-800 bg-opacity-15 p-2 ">
                    <button
                      onClick={() => {
                        setShowConfirmationModal(true);
                        setTypeOfConfirmation("DELETE_MESSAGES");
                      }}
                      className={`font-bold  rounded-lg  text-red-600 hover:text-white ${fontSize}`}
                    >
                      DELETE ALL MESSAGE FROM THIS CHAT
                    </button>
                    <p
                      className={`dark:text-gray-400 text-gray-900 ${fontSize}`}
                    >
                      This action is irreversible, Do it at your Own Risk
                    </p>
                  </div>
                  <div className="bg-red-800 bg-opacity-15 p-2 ">
                    <button
                      onClick={() => {
                        setShowConfirmationModal(true);
                        setTypeOfConfirmation("DELETE_CHAT");
                      }}
                      className={`font-bold  rounded-lg  text-red-600 hover:text-white ${fontSize}`}
                    >
                      DELETE ENTIRE CHAT
                    </button>
                    <p
                      className={`dark:text-gray-400 text-gray-900 ${fontSize}`}
                    >
                      This Includes Members, Messages And Basic information From
                      The Chat. Do it at your Own Risk
                    </p>
                  </div>
                </div>
              )}
          </div>
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onConfirm={() => {
              switch (typeOfConfirmation) {
                case "DELETE_MESSAGES":
                  handleEmptyMessagesFromChat(socket, activeChat, userProfile, token);
                  setShowConfirmationModal(false);
                  break;

                case "LEAVE_CHAT":
                  handleRemoveUsersFromGroup(
                    activeChat.data.id,
                    userProfile.id,
                    token,
                    dispatch
                  );
                  break;

                case "DELETE_CHAT":
                  handleDeleteEntireChat(socket, userProfile, activeChat, token);
                  setShowConfirmationModal(false);
                  break;

                default:
                  console.warn(
                    "UNKNOWN CONFIRMATION:",
                    typeOfConfirmation
                  );
              }
            }}
            onClose={() => setShowConfirmationModal(false)}
          />
        </div>
      </div>
    </>
  );
};

export default ChatInfo;
