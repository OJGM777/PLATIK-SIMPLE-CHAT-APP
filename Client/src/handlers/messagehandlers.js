import { socket } from "../API/SOCKET_IO.js";
import { deleteMessageById, updateMessageById } from "../API/messageCalls.js";
import {
  setIncrementeNumberOfUnreadNotifications,
  setLastMessageToChat,
  setNewMessage,
  setNotifications,
} from "../store/chatSlice.js";

export const handleDelete = async (messageId, chatId, toOpenMenu, token) => {
  try {
    const result = await deleteMessageById(messageId, token);
    if (result.error) return;

    socket.emit("deleted_Message", {
      deletedMessageId: messageId,
      roomId: chatId,
    });
    toOpenMenu(false);

    return () => {
      socket.off("deleted_Message");
    };
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdate = async (
  messageId,
  chatId,
  messageContent,
  token
) => {
  try {
    // console.log({messageId, chatId, messageContent, token })
    const result = await updateMessageById(messageId, messageContent, token);
    if (result.error) return;

    socket.emit("updated_message", {
      updatedMessageId: messageId,
      roomId: chatId,
      messageContent,
    });

    return () => {
      socket.off("updated_Message");
    };
  } catch (error) {
    console.log(error);
  }
};

export const handleMessageReceived = (
  newMessageReceived,
  dispatch,
  activeChat,
  user
) => {
  if (
    (!activeChat || activeChat?.data?.id !== newMessageReceived.chatId) &&
    newMessageReceived.senderId !== user.id
  )
    return;

  dispatch(
    setLastMessageToChat({
      LastMessage: {
        lastMessage: newMessageReceived.chatDescription,
        chatId: newMessageReceived.chatId,
        created: newMessageReceived.Created,
        isImage: newMessageReceived.isImage,
        senderName: newMessageReceived.senderName,
        isGroupChat: newMessageReceived.isGroupChat,
      },
    })
  );

  // Add the message to the current chat
  dispatch(setNewMessage({ newMessage: newMessageReceived }));
};

//// SIGUE MAÑANA, SEPARANDO CUANDO CAE UN MENSAJE EN EL CHAT Y CUANDO ESTAS AFUERA.

export const handledNotificationModals = (
  newMessageReceived,
  dispatch,
  activeChat,
  user
) => {

  if (
    (!activeChat || activeChat?.data?.id !== newMessageReceived.chatId) &&
    newMessageReceived.senderId !== user.id
  ) {
    // If the message is for a different chat, show a notification
    const newNotification = {
      id: Date.now(),
      chatId: newMessageReceived.chatId,
      chatName: newMessageReceived.chatName,
      chatDescription: newMessageReceived.chatDescription,
      chatImage: newMessageReceived.chatImage,
      isImage: newMessageReceived.isImage,
      isVisible: false,
      isMounted: true,
    };
    dispatch(
      setLastMessageToChat({
        LastMessage: {
          lastMessage: newMessageReceived.chatDescription,
          chatId: newMessageReceived.chatId,
          created: newMessageReceived.Created,
          isImage: newMessageReceived.isImage,
          senderName: newMessageReceived.senderName,
          isGroupChat: newMessageReceived.isGroupChat,
        },
      })
    );
    
    dispatch(setNotifications({ notifications: newNotification }));
    return dispatch(setIncrementeNumberOfUnreadNotifications({notificationChatId: newNotification.chatId}));
  } else {
    return;
  }
};
