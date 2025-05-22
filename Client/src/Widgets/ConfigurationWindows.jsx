import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fontSizeChange,
  toggleMode,
  setEnableNotifications,
} from "../store/chatSlice";
import UserInfoUpdate from "./UserInfoUpdate";
import { handleUnMuteChat } from "../handlers/chatHandlers";

const ConfigurationWindows = ({ WindowVar }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);
  const fontSize = useSelector((state) => state.fontSize);
  const enableNotifications = useSelector((state) => state.enableNotifications);
  const mutedChats = useSelector((state) => state.mutedChats);

  const toggleDarkMode = () => {
    dispatch(toggleMode());
  };

  const toggleNotifications = () => {
    dispatch(setEnableNotifications());
  };

  const changeFontSize = (size) => {
    dispatch(fontSizeChange({ fontSize: size }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div
        onClick={() => WindowVar(false)}
        className={`fixed ${fontSize}  inset-0 z-30 flex items-center justify-center flex-col bg-black bg-opacity-50`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="mx-auto min-h-[510px] max-h-[510px] max-md:min-h-[650px] max-md:max-h-[650px] overflow-y-auto dark:bg-gray-900 bg-gray-50 text-black dark:text-white shadow-md w-[60%] max-md:w-[99%] rounded-lg p-6"
        >
          {/* Barra Superior */}
          <div className="flex justify-center p-2 rounded-md dark:bg-slate-800 bg-slate-200 space-x-4 ">
            <button
              onClick={() => handleTabChange("tab1")}
              className={`px-4 py-2 rounded-md font-semibold ${
                activeTab === "tab1"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => handleTabChange("tab2")}
              className={`px-4 py-2 rounded-md font-semibold ${
                activeTab === "tab2"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              User
            </button>
          </div>
          {activeTab === "tab1" && (
            <>
              <br />
              <br />
              <br />
              <div className="mb-4 ">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className={fontSize}>Dark Mode</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      darkMode ? "bg-purple-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        darkMode ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </label>
              </div>
              <br />
              <div className="mb-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className={fontSize}>Notifications</span>
                  <button
                    onClick={toggleNotifications}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      enableNotifications ? "bg-purple-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        enableNotifications ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </label>
              </div>
              <br />
              <div className="mb-4">
                <label className={`block ${fontSize} mb-2`}>
                  Font Size
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => changeFontSize(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 bg-gray-200 dark:text-gray-100"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Medium</option>
                  <option value="text-2xl">Large</option>
                </select>
              </div>
              <br />
              {mutedChats.length > 0 ? (
                <div className="mb-4">
                <span key={1} className={fontSize}>
                  Muted Chats
                </span>
                <ul
                  key={"noseeee"}
                  className="bg-gray-700 flex flex-col gap-3 p-2 rounded-lg"
                >
                  {mutedChats.map((mutedChat) => (
                    <li
                      className="flex items-center  relative p-2 gap-2 bg-gray-800 rounded-md"
                      key={mutedChat.chatId}
                    >
                      <img
                        src={mutedChat.chatImage}
                        className="w-8 h-8 rounded-full dark:bg-gray-700"
                      />
                      <p className="font-semibold max-w-[70%] line-clamp-1">{mutedChat.chatName}</p>
                      <button
                        onClick={() => {
                          handleUnMuteChat(mutedChat, dispatch);
                        }}
                        className="bg-gray-700 px-2 py-1 rounded absolute right-2"
                      >
                        unmute
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              ) : null} 
            </>
          )}

          {activeTab === "tab2" && <UserInfoUpdate />}
        </div>
      </div>
    </>
  );
};

export default ConfigurationWindows;
