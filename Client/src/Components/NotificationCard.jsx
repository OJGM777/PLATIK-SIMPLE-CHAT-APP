import React from "react";
import { setUnseenNotificationsToZero } from "../store/chatSlice";

const NotificationCard = ({
  NotificationId,
  chatId,
  chatName,
  description,
  image,
  date,
  sendToChat,
  deleteNotificationsFromChat,
  dispatch,
}) => {
  return (
    <div
      onClick={(e) => {
        sendToChat(chatId, image, chatName);
        deleteNotificationsFromChat(chatId);
        dispatch(setUnseenNotificationsToZero({chatId: chatId}));
      }}
      className="dark:bg-gray-800 bg-gray-200 dark:text-white cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700 rounded-lg p-2 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-full dark:bg-gray-500 flex items-center justify-center font-bold dark:text-white">
        <img
          src={image}
          alt={`${chatName[0]}`}
          className="min-w-10 min-h-10 rounded-full"
        />
      </div>
      <div>
        <div className="font-medium line-clamp-1  text-base">{chatName}</div>
        <div className="text-sm text-gray-500 line-clamp-1 overflow-clip">
          {description}
        </div>
      </div>
      <div className="ml-auto text-xs text-gray-500">
        <p className="text-nowrap overflow-clip">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
