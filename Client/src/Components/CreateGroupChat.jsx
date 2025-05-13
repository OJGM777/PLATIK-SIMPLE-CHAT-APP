import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroupChat } from "../API/CreationCalls";
import LoadScreen from "./LoadScreen";
import AddUser from "../Widgets/AddUser";
import { setToUpdater } from "../store/chatSlice.js";
import { verifySize } from "../utilities/verifyImageSize.js";

const CreateGroupChat = ({ FRMvar }) => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [toWait, setToWait] = useState(false);
  const [selectSection, setSelectSection] = useState(["Name And Description", "Add Users", "Add Image"])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const fontSize = useSelector((state) => state.fontSize); 

  const user = useSelector((state) => state.userInfo);
  const Token = useSelector((state) => state.tokenInfo);
  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const verifyingSize = verifySize(file, 5);
    if(!verifyingSize){
      setImage(null);
      return alert("File must not exceed the 5MB")
    }
    setImage(file);
  };

  
  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateChat = async () => {
    setToWait(true)
    try {
      const usersList = users;
      usersList.unshift(user.id);

      const result = await createGroupChat(
        groupName,
        usersList,
        description,
        image,
        user.id,
        Token
      );

      if (result?.error) {
        console.log(result);
      } else {
        dispatch(setToUpdater());
        return console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      FRMvar(false);
      setToWait(false);
    }
  };

  return (
    <>
    {toWait && <LoadScreen />}
      <div
        onClick={() => FRMvar(false)}
        className={`fixed inset-0 z-30 ${fontSize} flex items-center justify-center flex-col bg-black bg-opacity-50`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="dark:bg-gray-900 dark:text-white bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
        >
          <h2 className={`${fontSize} font-bold mb-4`}>Create New Chat</h2>
          <div className={`mb-4 ${innerWidth < 1020 ? currentIndex === 0 ? '':'hidden'  : ""}`}>
            <label className={`block ${fontSize}font-medium dark:text-white`}>
              Nombre del Grupo
            </label>
            <input
              type="text"
              maxLength={"30"}
              placeholder="Chat Name"
              className={`mt-1 block ${fontSize} w-full px-3 py-2 border dark:border-gray-900 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 `}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <AddUser section={currentIndex} userAdder={setUsers}/>
          <div className={`mb-4 ${currentIndex === 0 ? '':'hidden' }`}>
            <label className={`block ${fontSize} font-medium dark:text-white`}>
              Group Description
            </label>
            <textarea
              placeholder="Write a description for the group"
              className={`mt-1 block ${fontSize} w-full px-3 min-h-[70%] resize-none py-2 border dark:border-gray-900 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 `}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={`mb-4 ${innerWidth < 1020 ? currentIndex === 2 ? '':'hidden'  : ""}`}>
            <label className="block text-sm font-medium dark:text-white">
              Select An Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm dark:text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-indigo-100"
              onChange={handleImageUpload}
            />
          </div>
          <button
            onClick={handleCreateChat}
            className={`w-full bg-purple-500 text-white py-2 px-4 rounded-md ${innerWidth < 1020 ? currentIndex === 2 ? '':'hidden'  : ""}`} 
          >
            Crear Chat
          </button>

          <div className={`flex justify-between mt-[5%] ${innerWidth < 1020 ? "" : "hidden"}`}>
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            else{
              return;
            }
            }}
            className={`w-[30%] bg-purple-500 ${currentIndex === 0 ? "hidden" : ""} text-white py-2 px-4 rounded-md`} 
          >
            Prev
          </button>
          <button
            onClick={() => {
              if (currentIndex < selectSection.length - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            className={`w-[30%] bg-purple-500 ${currentIndex === 2 ? "hidden" : ""} text-white py-2 px-4 rounded-md`} 
          >
            Next
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGroupChat;
