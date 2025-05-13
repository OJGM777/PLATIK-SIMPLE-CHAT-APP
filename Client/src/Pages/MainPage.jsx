import React, { useEffect, useState } from "react";
import CreateGroupChat from "../Components/CreateGroupChat.jsx";
import ChatSidebar from "../Components/ChatSidebar.jsx";
import ConfigurationWindows from "../Widgets/ConfigurationWindows.jsx";
import NotificationComponent from "../Widgets/NotificationComponent..jsx";
import { socket } from "../API/SOCKET_IO.js";
import { useDispatch, useSelector } from "react-redux";
import NotificationsContainer from "../Widgets/NotificationsContainer.jsx";
import { handleDeletedChat, handleKickedUser } from "../handlers/chatHandlers.js";
import { useNavigate } from "react-router-dom";
import { handledNotificationModals, handleMessageReceived } from "../handlers/messagehandlers.js";

const MainPage = () => {
  const [openFRM, setOpenFRM] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const user = useSelector((state) => state.userInfo);
  const tokenInfo = useSelector((state) => state.tokenInfo);
  const activeChat = useSelector((state) => state.activeChat); // Current active chat
  const dispatch = useDispatch(); // Redux dispatcher
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("setup", user); // Emit user setup event
    socket.on("connected", () => setSocketConnected(true)); // Listen for connection success
    // Cleanup socket events on component unmount
    return () => {
      socket.off("connected");
      socket.off("setup");
    };
  }, [user]);



  // Handle incoming messages via socket // WEB SOCKET SECTION!!!
  useEffect(() => {
 
    // };

    socket.on("message_received", (newMessageReceived) => handleMessageReceived(newMessageReceived, dispatch, activeChat, user)); // Listen for incoming messages
    socket.on("notification_received", (newMessageReceived) => handledNotificationModals(newMessageReceived, dispatch, activeChat, user));
    socket.on("kicked_user", (kickedUserId) => handleKickedUser(kickedUserId, user, navigate, dispatch))
    socket.on("chat_deleted", () => handleDeletedChat(navigate, dispatch));
    // Cleanup the event listener on component unmount
    return () => {
      socket.off("message_received");
      socket.off("notification_received");
    };
  }, [activeChat, user, dispatch]);

  /////////////////////////////

  return (
    <div className="flex h-screen bg-gray-100">
      <NotificationComponent userId={user.id} token={tokenInfo}/>
      <ChatSidebar openFRM={setOpenFRM} openConfigs={setOpenConfig} openNotifications={setOpenNotifications} />
      {openFRM && <CreateGroupChat FRMvar={setOpenFRM} />}
      {openConfig && <ConfigurationWindows WindowVar={setOpenConfig} />}
      {openNotifications && <NotificationsContainer closeVar={setOpenNotifications}/>}
    </div>
  );
};

export default MainPage;
