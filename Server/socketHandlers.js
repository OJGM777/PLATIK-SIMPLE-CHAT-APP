import { sendNotifications } from "./Controllers/notificationsController.js";

export const connectedUsers = new Map();

const handleSocketEvents = (io, socket) => {
  // REGISTER CONNECTED AND DISCONECTED USERS

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
    connectedUsers.set(userData.id, {
      socketId: socket.id,
      activeChatId: connectedUsers.get(userData.id)?.activeChatId || null,
    });
  });

  socket.on("disconnect", () => {
    for (let [userId, data] of connectedUsers.entries()) {
      if (data.socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
  /////

  socket.on("join_chat", (roomData) => {
    socket.join(roomData.room);
    if (connectedUsers.has(roomData.userId)) {
      let userData = connectedUsers.get(roomData.userId);
      connectedUsers.delete(roomData.userId);
      userData.activeChatId = roomData.room;
      connectedUsers.set(roomData.userId, userData);
    };

  });


  socket.on("exit_chat", (userInfo) => {
    if(connectedUsers.has(userInfo.id)){
      let userData = connectedUsers.get(userInfo.id);
      connectedUsers.delete(userInfo.id);
      userData.activeChatId = null;
      connectedUsers.set(userInfo.id, userData);
    }
  });

  //// THIS SECTION SENDS NOTIFICATIONS TO DISCONNECTED USERS OR USERS THAT ARE IN OTHER CHAT
  socket.on("new_message", async(newMessage) => {
    if (!newMessage.chatId) return console.log("Chat ID is not defined");
    console.log(newMessage);
    io.to(newMessage.chatId).emit("message_received", newMessage);

    //TO SEND TO THE USERS THAT ARE CONNECTED BUT IN A DIFERENT ACTIVE CHAT
    for(const [userId, userData] of connectedUsers.entries()) {
      if(userData.activeChatId !== newMessage.chatId){
        io.to(userData.socketId).emit("notification_received", newMessage);
      }
    }

    /// SEND NOTIFICATIONS TO BOTH: CONNECTED USERS THAT ARE IN A DIFFERENT CHAT AND DISCONNECTED USERS
    await sendNotifications(newMessage)
  });

  ////

  socket.on("is_Typing", (TypingInfo) => {
    if (!TypingInfo.userName || !TypingInfo.id || !TypingInfo.roomId)
      return console.log("Incomplete Parameters");

    io.to(TypingInfo.roomId).emit("typing", {
      isTyping: true,
      userId: TypingInfo.id,
      userName: TypingInfo.userName,
      roomId: TypingInfo.roomId,
    });
  });

  socket.on("deleted_Message", (messageData) => {
    if (!messageData.deletedMessageId || !messageData.roomId)
      return console.log("Incomplete Parameters");

    io.to(messageData.roomId).emit(
      "message_removed",
      messageData.deletedMessageId
    );
  });

  socket.on("updated_message", (messageData) => {
    if (
      !messageData.updatedMessageId ||
      !messageData.roomId ||
      !messageData.messageContent
    )
      return console.log("Incomplete Parameters");

    io.to(messageData.roomId).emit("message_updated", {
      messageIdToUpdate: messageData.updatedMessageId,
      newMessageContent: messageData.messageContent,
    });
  });

  socket.on("all_messages_deleted", (messageData) => {
    if (!messageData.chatAdminId || !messageData.roomId)
      return console.log("INCOMPLETE PARAMETERS");

    io.to(messageData.roomId).emit("delete_all_messages");
  });

  socket.on("entire_chat_deleted", (messageData) => {
    if (!messageData.chatAdminId || !messageData.roomId)
      return console.log("INCOMPLETE PARAMETERS");

    io.to(messageData.roomId).emit("chat_deleted");
  });

  socket.on("kick_an_user", (messageData) => {
    if (!messageData.kickedUserId || !messageData.roomId)
      return console.log("INCOMPLETE PARAMETERS");

    io.to(messageData.roomId).emit("kicked_user", messageData.kickedUserId);
    io.to(messageData.kickedUserId).emit(
      "kicked_user",
      messageData.kickedUserId
    );
  });
};

export default handleSocketEvents;
