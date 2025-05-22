import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setActiveChat,
  setMessages,
  setUnseenNotificationsToZero,
} from "../store/chatSlice.js";
import { handleDeleteNotificationsFromChat } from "../handlers/notificationsHandlers";

const ChatComponent = ({ userId, chatInfo, tokenInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.fontSize);
  const activeChat = useSelector((state) => state.activeChat);
  const selected = activeChat?.data?.id === chatInfo.id;

  const handleClick = () => {
    navigate(`/chat/${chatInfo.id}`, {
      state: {
        background: location,
        chatImage: chatInfo.isGroupChat
          ? chatInfo.ChatImage
          : chatInfo.altChatImage,
        chatName: chatInfo.ChatName,
      },
      replace: true,
    });

    dispatch(setUnseenNotificationsToZero({ chatId: chatInfo.id }));
    handleDeleteNotificationsFromChat(userId, chatInfo.id, tokenInfo);
    dispatch(setActiveChat({ activeChat: null }));
    dispatch(setMessages({ messages: null }));
  };
  return (
    <li
      onClick={handleClick}
      className={`mb-2 ${fontSize} ${
        selected ? "bg-gray-600" : "bg-gray-300 dark:bg-gray-800"
      } flex p-3 rounded-lg relative transition-all items-center gap-3 cursor-pointer`}
    >
      <img
        src={chatInfo.isGroupChat ? chatInfo.ChatImage : chatInfo.altChatImage}
        className="w-8 h-8 rounded-full bg-gray-700"
      />
      <div className="w-[70%]">
        <p
          className={`font-semibold ${fontSize} ${
            selected ? "text-gray-100" : "text-black dark:text-white"
          } line-clamp-1`}
        >
          {chatInfo.ChatName}
        </p>
        <p
          className={`${fontSize} ${
            selected ? "text-gray-400" : "text-gray-600"
          } dark:text-gray-500 line-clamp-1`}
        >
          {chatInfo.LastMessage}
        </p>
      </div>
      {chatInfo.notificationsCount > 0 ? (
        <span className="absolute top-1/2 -translate-y-1/2 right-3 h-6 w-6 flex justify-center items-center rounded-full bg-purple-700 text-white text-sm">
          <p className="mt-[1px]">{chatInfo.notificationsCount}</p>
        </span>
      ) : null}
    </li>
  );
};

export default ChatComponent;
