import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotifications, setToUpdater } from "../store/chatSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { handleDeleteNotificationsFromChat } from "../handlers/notificationsHandlers";

const NotificationComponent = ({ userId, token }) => {
  const notifications = useSelector((state) => state.notifications);
  const enableNotifications = useSelector((state) => state.enableNotifications);
  const [modalNotifications, setModalNotifications] = useState([]);
  const mutedChats = useSelector((state) => state.mutedChats);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (notifications.length > 0 && enableNotifications) {
      const newNotification = notifications[notifications.length - 1]; // TAKES THE LAST NOTIFICATION
      if (mutedChats.some((chat) => chat.id === newNotification.chatId)) return; /// THIS LINE STOPS THE NOTIFICATION IF THE CHAT ID IS IN THE MUTED LIST
      setTimeout(() => {
        setModalNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
          setModalNotifications((prev) =>
            prev.map((n) =>
              n.id === newNotification.id ? { ...n, isVisible: true } : n
            )
          );
        }, 50);

        // Configura el desmontaje después de un tiempo
        setTimeout(() => {
          handleDismiss(newNotification.id);
          dispatch(removeNotifications());
        }, 10000);
      }, 300);
    }
  }, [notifications]);

  const handleDismiss = (id) => {
    
    setModalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isVisible: false } : n))
    );

    
    setTimeout(() => {
      setModalNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 500);
  };

  const handleClick = (nId, chatId, profilePicture, chatName) => {
    navigate(`/chat/${chatId}`, {
      state: {
        background: location,
        chatImage: profilePicture,
        chatName: chatName,
      },
      replace: true,
    });

    handleDismiss(nId);
    dispatch(setToUpdater());

    handleDeleteNotificationsFromChat(userId, chatId, token); //// ADD NUMBERS TO CHAT COMPONENT
  };

  return (
    <div
      key={"NOSE"}
      className="flex flex-col w-[25%] gap-2 z-50 right-2 fixed "
    >
      {/* Renderiza las notificaciones */}
      {modalNotifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() =>
            handleClick(
              notification.id,
              notification.chatId,
              notification.chatImage,
              notification.chatName
            )
          }
          className={`transition-all p-2 cursor-pointer rounded relative flex dark:bg-gray-700 bg-gray-400 border-r-purple-800 border-r-[8px] text-white   w-full duration-500 ease-in-out ${
            notification.isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1">
            <p className="line-clamp-1">{notification.chatName}</p>
            <p className="dark:text-gray-400 text-white line-clamp-1">
              {" "}
              {!notification.isImage
                ? notification.chatDescription
                : " 🖼️ IMAGE"}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss(notification.id);
            }}
            className="absolute right-2 flex top-6 text-[18px] h-7 w-7 text-center justify-center rounded bg-red-600"
          >
            <p>X</p>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
