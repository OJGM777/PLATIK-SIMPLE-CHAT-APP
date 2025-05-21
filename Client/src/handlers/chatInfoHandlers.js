import {
  deleteAllMessagesFromChat,
  deleteEntireChat,
  getUserChats,
  updateChatInfo,
} from "../API/chatCalls.js";
import { setToUpdater } from "../store/chatSlice.js";

export const handleUpdate = async (
  setToWait,
  activeChat,
  chatName,
  description,
  newProfilePicture,
  profilePicture,
  token,
  dispatch,
  setToUpdate,
  user
) => {
  setToWait(true);
  try {
    await updateChatInfo(
      activeChat.data.id,
      chatName,
      description,
      newProfilePicture ? newProfilePicture : profilePicture,
      token,
      dispatch,
      activeChat.data.ChatImage
    );
    await getUserChats(user.id, dispatch, token);
  } catch (error) {
    console.error("Error updating chat info:", error);
  } finally {
    setToWait(false);
    setToUpdate(false);
    dispatch(setToUpdater());
  }
}; 

export const handleDeleteEntireChat = async (
  socket,
  userProfile,
  activeChat,
  token
) => {
  try {
    const result = await deleteEntireChat(
      activeChat.data.id,
      userProfile.id,
      token
    );

    if (result.deleted) {
      socket.emit("entire_chat_deleted", {
        chatAdminId: activeChat.data.ChatAdmin,
        roomId: activeChat.data.id,
      });

      return () => {
        socket.off("all_messages_deleted");
      };
    }
  } catch (error) {
    console.error("Error FROM GROUP:", error);
  }
}; 

export const handleEmptyMessagesFromChat = async (socket, activeChat, userProfile, token) => {
  try {
    const result = await deleteAllMessagesFromChat(
      activeChat?.data?.id,
      userProfile.id,
      token
    );

    if (result.deleted) {
      socket.emit("all_messages_deleted", {
        chatAdminId: activeChat.data?.ChatAdmin,
        roomId: activeChat.data?.id,
      });

      return () => {
        socket.off("all_messages_deleted");
      };
    }
  } catch (error) {
    console.error("Error FROM GROUP:", error);
  }
}; 
