// THIS ENTIRE FILE IS USED TO STORAGE ALL THE CHAT WINDOW'S FUNCTIONS, THIS THAT INCLUDES FETCHING AND STATE MANAGEMENT
// MESSAGES, CHAT ADMIN ACTIONS AND IN-REAL TIME ACTIONS WILL BE STORAGED HERE.
//ALL SOCKET IO "ON" FUNCTIONS ARE ALOCATED IN THE CHAT WINDOW COMPONENT
// SOME SOCKET IO "EMIT" FUNCTIONS ARE HERE TOO: SEND MESSAGE, DELETE MESSAGE, UPDATE ETC....



import { addUsersToGroup, removeUserFromGroup } from "../API/chatCalls";
import {
  deleteKickedUserFromState,
  deleteMessageFromState,
  muteChat,
  setActiveChat,
  setDeleteAllMessagesFromState,
  setMessages,
  setToUpdater,
  unMuteChat,
  updateMessageFromState,
} from "../store/chatSlice.js";
import { socket } from "../API/SOCKET_IO";
import { createOneToOneChat } from "../API/CreationCalls.js";
import {
  createAndSendImage,
  createAndSendMessage,
} from "../API/messageCalls.js";
import { handleUpdate } from "./messagehandlers.js";
// import { sendNotificationsToBackend } from "../API/notificationsCalls.js";

///ALMOST THE SAME THE "HANDLE KICKED USER" FUNCTION, BUT THIS ONE IS FOR THE ADMIN
export const handleRemoveUsersFromGroup = async (
  chatid,
  userId,
  token,
  dispatch
) => {
  try {
    const result = await removeUserFromGroup(chatid, userId, token);

    if (!result.success) {
      return console.error("SOMETHING WRONG HAPPENEED WHILE KICKING USER OUT");
    }

    socket.emit("kick_an_user", { roomId: chatid, kickedUserId: userId });

    return () => {
      socket.off("kick_an_user");
    };
  } catch (error) {
    console.error(error);
  }
};

///THIS SECTION HANDLES WHEN THE ADMIN ADDS A NEW MEMBER IN THE GROUP

export const handleAddUserToGroup = async (
  newUsers,
  activeChat,
  waitVar,
  visibleSectionVar,
  usersSetter,
  token,
  dispatch
) => {
  waitVar(true);
  try {
    const filteredUsers = newUsers.filter(
      (user) => !activeChat.users.find((u) => u.UserId === user)
    );

    const newActiveChat = await addUsersToGroup(
      activeChat.data.id,
      filteredUsers,
      token
    );
    dispatch(setActiveChat({ activeChat: newActiveChat }));
  } catch (error) {
    console.error("Error adding user to group:", error);
  } finally {
    waitVar(false);
    usersSetter([]);
    visibleSectionVar(false);
  }
};

///THIS SECTION HANDLES WHEN THE ADMIN KICKS AN USER OUT FROM THE GROUP OR THE USER LEAVES THE GROUP (THIS SECTION IS MOSLTY FOR REDUX, TO HAVE IN-REAL TIME ACTIONS WHEN THE USER GETS KICKED FROM THE CHAT)
export const handleKickedUser = (kickedUserId, user, navigate, dispatch) => {
  if (kickedUserId === user.id) {
    //IF THE ELIMINATED USER IS YOU, REDUX WILL HAVE TO PERFORM THIS ACTIONS:
    navigate("/home", {
      replace: true,
    });

    dispatch(setToUpdater());
    dispatch(setMessages({ messages: [] }));
    dispatch(setActiveChat({ activeChat: null }));
  }
  return dispatch(deleteKickedUserFromState({ kickedUserId: kickedUserId }));
};

//THIS FUNCTION HAS THE LOGIC TO CREATE A DUAL CHAT IF IT ALREADY EXISTS, THE FUNCTION WILL SEND THE ID TO USE NAVIGATE AND GET IN THE CHAT
export const handleCreateDualChat = async (
  memberUser,
  user,
  Token,
  navigate,
  dispatch,
  waitVar
) => {
  waitVar(true);

  const userMemberId = memberUser.UserId ? memberUser.UserId : memberUser.id;

  try {
    const chatInfo = await createOneToOneChat(user.id, userMemberId, Token);

    if (chatInfo?.error) {
      return console.log(result);
    }

    if (chatInfo.exists) {
      dispatch(setActiveChat({ activeChat: null }));
      dispatch(setMessages({ messages: null }));

      return navigate(`/chat/${chatInfo.chatData.id}`, {
        state: {
          background: "/home",
          chatImage: memberUser.ProfilePicture,
          chatName: chatInfo.chatData.ChatName,
        },

        replace: true,
      });
    }

    return navigate(`/chat/${chatInfo.id}`, {
      state: {
        background: "/home",
        chatImage: memberUser.ProfilePicture,
        chatName: chatInfo.ChatName,
      },
      replace: true,
    });
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setToUpdater());
    waitVar(false);
  }
};

// THIS SECTION MUTES THE SELECTED CHAT
export const handleMuteChat = (mutedChatData, ProfilePicture, dispatch) => {
  console.log(mutedChatData);
  dispatch(
    muteChat({
      mutedChat: {
        id: mutedChatData.id,
        chatName: mutedChatData.ChatName,
        chatImage: ProfilePicture,
      },
    })
  );
};

// THIS SECTION UNMUTES THE CHAT

export const handleUnMuteChat = (mutedChatData, dispatch) => {
  dispatch(unMuteChat({ mutedChatId: mutedChatData.id }));
};

///// THIS SECTIONS ARE FOR THE CHAT WINDOW

export const handleExitClick = (dispatch, navigate, dataChat, user) => {
  dispatch(setActiveChat({ activeChat: null }));
  navigate(`/home`, {
    replace: true,
  });

  socket.emit("exit_chat", { id: user.id, roomId: dataChat.id})

  return () => {
    socket.off("exit_chat");
  }
};

/// THIS SECTION INCLUDES ALL THE SOCKET-IO RELATED THING, AS IN SENDING MESSAGES.

/// THIS PART INCLUDES ALL THE LOGIC TO SEND MESSAGES ON THE CHATWINDOW
export const sendMessageInfo = async (
  setNewMessageContent,
  newMessageContent,
  user,
  activeChat,
  socket,
  token,
  chatImage
) => {
  setNewMessageContent(""); // Clear input
  try {
    if (newMessageContent.trim().length < 1) return; // Prevent empty messages
    const newMessage = await createAndSendMessage(
      activeChat.data.id,
      newMessageContent,
      user.id,
      token
    ); // API call to send the message
    // 
    // ;
    // Prepare message data for the socket event
    const messageData = {
      id: newMessage.id,
      chatId: newMessage.ChatId,
      chatName: activeChat.data.ChatName,
      senderId: newMessage.userSenderId,
      senderName: newMessage.senderName,
      chatDescription: newMessage.Content,
      Created: newMessage.Created,
      isImage: newMessage.isImage,
      isGroupChat: newMessage.isGroupChat,
      chatImage: activeChat.data.isGroupChat ? chatImage : user.ProfilePicture,
      senderProfilePicture: newMessage.senderPic,
    };
    socket.emit("new_message", messageData); // Emit the new message event
    // await sendNotificationsToBackend(messageData, token);

    return () => {
      socket.off("new_message");
    };
  } catch (error) {
    console.error(error);
  }
};

//// THIS SECTION HANDLES ALL THE FUNCTIONS AND LOGIC  RELATED TO SHOW USERS THAT ARE WRITING IN THE CHAT AND RECEIVING THEIR INFO

export const handleTyping = (socket, user, activeChat) => {
  socket.emit("is_Typing", {
    userName: user.name,
    id: user.id,
    roomId: activeChat.data.id,
  });

  return () => {
    socket.off("is_Typing");
  };
};

let typingTimeoutId = null;

export const handleUserTyping = (typingInfo, setIstyping, socket) => {
  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId);
  }
  setIstyping({
    typing: true,
    name: typingInfo.userName,
    userId: typingInfo.userId,
    roomId: typingInfo.roomId,
  });

  typingTimeoutId = setTimeout(() => {
    setIstyping({ typing: false, name: "", userId: "", roomId: "" });
  }, 1000);
  return () => {
    socket.off("typing");
  };
};

/// THIS SECTION HAS ALL THE LOGIC AND FUNCTIONS TO SEND OR DISCARD AN IMAGE, THIS INCLUDES THE PREVIEW.

export const sendImageInfo = async (
  setLoadingScreen,
  activeChat,
  user,
  token,
  chatImage,
  socket,
  newImage,
  setNewImage,
  setPreviewImage
) => {
  setLoadingScreen(true);
  try {
    const newMessage = await createAndSendImage(
      activeChat.data.id,
      newImage,
      user.id,
      token
    );

    const messageData = {
      id: newMessage.id,
      chatId: newMessage.ChatId,
      chatName: activeChat.data.ChatName,
      senderId: newMessage.userSenderId,
      senderName: newMessage.senderName,
      chatDescription: newMessage.Content,
      Created: newMessage.Created,
      isImage: newMessage.isImage,
      isGroupChat: newMessage.isGroupChat,
      chatImage: activeChat.data.isGroupChat ? chatImage : user.ProfilePicture,
      senderProfilePicture: newMessage.senderPic,

    };
    socket.emit("new_message", messageData);


    return () => {
      socket.off("new_message");
    };

  } catch (error) {
    console.error(error);
  } finally {
    setNewImage(null);
    setPreviewImage(null);
    setLoadingScreen(false);
  }
};

/////// THIS SECTIONS HAS LOGIC TO DELETE THE CHAT

export const handleDeletedChat = (navigate, dispatch) => {
  dispatch(setMessages({ messages: [] }));
  dispatch(setActiveChat({ activeChat: null }));
  dispatch(setToUpdater());

  navigate("/home", {
    replace: true,
  });
};

/// IN CASE THAT THE CHAT ADMIN DELETES ALL THE MESSAGES, REDUX WILL PERFORM ITS REDUCER:

export const handleDeleteAllMessages = (dispatch) => {
  dispatch(setDeleteAllMessagesFromState());
};

///// IN CASE THAT SOMEONE IN THE CHAT UPDATES A MESSAGES, REDUX WILL PERFORM THIS REDUCER:

export const handleUpdatedMessage = (updatedMessageData, dispatch) => {
  // THIS ONE TO SEPARATE
  dispatch(
    updateMessageFromState({
      messageContent: updatedMessageData.newMessageContent,
      messageIdToUpdate: updatedMessageData.messageIdToUpdate,
    })
  );
};

export const handleDeleteMessage = (deletedMessageId, dispatch) => {
  /// THIS ONE TO SEPARATE
  dispatch(deleteMessageFromState({ messageId: deletedMessageId }));
};

// THIS SECTION HANDLES THE "ENTER" KEY 

export const handlePressEnter = (
    e,
    discardUpdate,
    inputToUpdate,
    setLoadingScreen,
    activeChat,
    user,
    token,
    chatImage,
    socket,
    newImage,
    setNewImage,
    setPreviewImage,
    selectedId,
    selectedMessageContent,
    newMessageContent,
    setNewMessageContent,
    setOpenedEmojiMenu,
  ) => {
    if (e.key === "Enter") {
      setOpenedEmojiMenu(false);
      if (newImage) {
        sendImageInfo(
          setLoadingScreen,
          activeChat,
          user,
          token,
          chatImage,
          socket,
          newImage,
          setNewImage,
          setPreviewImage
        );
      }
      if (inputToUpdate) {
        handleUpdate(
          selectedId,
          activeChat.data.id,
          selectedMessageContent,
          token
        );
        return discardUpdate();
      }

      sendMessageInfo(
        setNewMessageContent,
        newMessageContent,
        user,
        activeChat,
        socket,
        token,
        chatImage
      );
    }
  };