import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileInfo from "./ProfileInfo.jsx";
import { getUserChats } from "../API/chatCalls.js";
import ChatComponent from "./ChatComponent.jsx";
import SkeletonLoader from "../Skeletons/SkeletonLoader.jsx";
import SearchWindow from "./SearchWindow.jsx";
import { handleSetNotifications } from "../handlers/notificationsHandlers.js";



const ChatSidebar = ({ openFRM, openConfigs, openNotifications }) => {
  const [openProfileInfo, setOpenProfileInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSearchWindow, setOpenSearchWindow] = useState(false);
  const user = useSelector((state) => state.userInfo);
  const chats = useSelector((state) => state.chats);
  const Token = useSelector((state) => state.tokenInfo);
  const fontSize = useSelector((state) => state.fontSize);
  const Updater = useSelector((state) => state.toUpdate);
  const dispatch = useDispatch();
  
  const handleInitiation = async () => {
    try {
      setIsLoading(true);
  
      await getUserChats(user.id, dispatch, Token);
      await handleSetNotifications(user.id, 1000, 0, Token, dispatch);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserChats(user.id, dispatch, Token);
  }, [Token, Updater]);


  useEffect(() => {
    handleInitiation();
  }, [])


  return (
    <>
      {openProfileInfo && (
        <ProfileInfo id={user.id} closeVar={setOpenProfileInfo} />
      )}
      {
        openSearchWindow && (
          <SearchWindow closeWindow={setOpenSearchWindow}/>
        )
      }
      {/* Sidebar */}
      <div className="max-lg:w-[100vw] w-[18vw] bg-gray-50 dark:bg-gray-900 relative dark:text-white p-4">
        <div className={`text-lg font-bold  mb-4`}><p className={fontSize}>PLATIK</p></div>
        <button
          onClick={() =>
            setOpenSearchWindow(true)
          }
          className={`w-full ${fontSize} hover:bg-purple-600 p-2 mb-4 bg-gray-300 dark:bg-gray-800 rounded dark:hover:bg-purple-600  focus:outline-none`}
        >
          Search
        </button>
        <div onClick={() => openFRM(true)} className="relative">
          <h3 className={`font-semibold flex ${fontSize} items-center rounded cursor-pointer transition-all duration-200 hover:bg-purple-600 dark:hover:bg-purple-600 justify-between dark:bg-gray-800 p-1 bg-gray-300 dark:text-gray-300 mb-2`}>
            <p>Create a New Chat</p>
            <p className={fontSize}>+</p>
          </h3>
        </div>
        <div className="relative">
          {/* <h3 className="font-semibold text-gray-300 mb-2">Other Contacts</h3> */}
          {isLoading ? (
            <>
              <SkeletonLoader />
            </>
          ) : (
            <ul className="flex max-h-[550px] overflow-auto  flex-col ">
              {chats?.map((chat, index) => (
                <ChatComponent key={index} chatInfo={chat}  userId={user.id} tokenInfo={Token} />
              ))}
            </ul>
          )}
        </div>
        {/* User Profile Card */}
        <div className="flex items-center  w-full gap-3 flex-1 bg-gray-300 dark:bg-gray-700 absolute bottom-0 right-0 p-1">
          <div
            onClick={() => setOpenProfileInfo(true)}
            className="flex items-center hover:bg-slate-200 dark:hover:bg-gray-800 cursor-pointer rounded-lg transition-all gap-3 p-1 w-[85%]"
          >
            <img
              src={user.ProfilePicture}
              className="w-8 h-8 rounded-full dark:bg-gray-600"
            />
            <p className={`font-semibold ${fontSize} w-[75%] line-clamp-1`}>{user.name}</p>
          </div>
          <button onClick={() => openNotifications(true)}  className={`cursor-pointer  ${fontSize} hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-2`}>🔔</button>
          <button onClick={() => openConfigs(true)} className={`cursor-pointer  ${fontSize} hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-2`}>⚙️</button>
        </div>
        {/* MESSAGE MAIN PAGE*/}
        <div className=" max-lg:hidden text-center fixed top-[30%] left-[50%] w-[10%] text-gray-500">
          <img
            className="w-full"
            src="https://cdn3.iconfinder.com/data/icons/gray-toolbar-4/512/chat-512.png"
            alt=""
          />
          <p className={fontSize}>{user.name}</p>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
