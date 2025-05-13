import React, { useEffect, useState } from "react";
import {
  getUserNotifications,
} from "../API/notificationsCalls.js";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../Components/NotificationCard.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { setActiveChat, setMessages } from "../store/chatSlice.js";
import NotificationsSkeleton from "../Skeletons/NotificationContainerSkeleton.jsx";
import { handleDeleteNotificationsFromChat } from "../handlers/notificationsHandlers.js";

const NotificationsContainer = ({ closeVar }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const tokenInfo = useSelector((state) => state.tokenInfo);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchUsersNotifications = async () => {
      setIsLoading(true)
     try {
      const notifications = await getUserNotifications(
        userInfo.id,
        limit,
        offset,
        tokenInfo
      );
      setNotifications(notifications.notifications);
     } catch (error) {
      console.error(error);
     }
     finally{
      setIsLoading(false);
     }
    };

    fetchUsersNotifications();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const getInTheChat = (chatId, image, chatName) => {
    navigate(`/chat/${chatId}`, {
      state: {
        background: location,
        chatImage: image,
        chatName: chatName,
      },
      replace: true,
    });

    dispatch(setActiveChat({ activeChat: null }));
    dispatch(setMessages({ messages: null }));
    closeVar(false);
  };

 
  return (
    <>
      {loading ? (<NotificationsSkeleton/>) : (
        <div
        onClick={() => closeVar(false)}
        className={`fixed inset-0 z-30  flex items-center justify-center flex-col bg-black bg-opacity-50`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" fixed z-30 max-w-[40%] max-md:max-w-[85%] max-md:max-h-[75%] max-md:top-[10%] rounded-lg  inset-2 mx-auto p-6 dark:bg-gray-900 bg-gray-300 dark:text-white"
        >
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
          <div className="space-y-4">
            {notifications?.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationCard
                  NotificationId={notification.id}
                  chatName={notification.ChatName}
                  image={notification.chatImage}
                  chatId={notification.chatId}
                  date={notification.lastUpdated}
                  key={index}
                  description={notification.message}
                  sendToChat={getInTheChat}
                  dispatch={dispatch}
                  deleteNotificationsFromChat={() =>
                    handleDeleteNotificationsFromChat(userInfo.id, notification.chatId, tokenInfo)
                  }
                />
              ))
            ) : (
              <p className="m-auto p-2 text-xl text-center mt-[25%]">No Notifications :/</p>
            )}
          </div>
        </div>
      </div>
      )}
    </> 
  );
};

export default NotificationsContainer;
