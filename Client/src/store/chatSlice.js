import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  tokenInfo: null,
  chats: [],
  emojisToUse: [],
  activeChat: null,
  messages: [],
  pendingMessagesFromBottom : 0,
  notifications: [],
  mutedChats: JSON.parse(localStorage.getItem("mutedChats")) || [],
  toUpdate: false,
  darkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false,
  fontSize: JSON.parse(localStorage.getItem("fontSize")) || "text-base",
  enableNotifications:JSON.parse(localStorage.getItem("enableNotifications")) || true,
  
};

export const chatAppSlice = createSlice({
  name: "chatApp",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.tokenInfo = action.payload.tokenInfo;
    },

    setLogOut: (state) => {
      state.userInfo = null;
      state.tokenInfo = null;
      state.chats = [];
      state.activeChat = null;
      state.messages = [];
      state.notifications = [];
      localStorage.setItem("mutedChats", JSON.stringify([]))

    },

    setEmojisToUse: (state, action) => {
      state.emojisToUse = action.payload.emojis;
    },

    setChats: (state, action) => {
      state.chats = action.payload.chats.map(chat => ({
        ...chat,
        notificationsCount: 0, 
      }));
      state.chats.sort((a, b) => new Date(b.LastMessageDate) - new Date(a.LastMessageDate));
    },
    
    setToUpdater: (state) => {
      state.toUpdate = !state.toUpdate;
    },

    setActiveChat: (state, action) => {
      state.activeChat = action.payload.activeChat;
    },

    setMessages: (state, action) => {
      if(!action.payload.messages) return;

       return {
        ...state,
        messages: action.payload.messages.sort((b, a) =>  new Date(b.Created) - new Date(a.Created))
      };
    },

    setPaginationMessages: (state, action) => {
     const existingIds = new Set(state.messages.map(msg => msg.id));

      const uniqueMessages = action.payload.messages.filter(
        newMessage => !existingIds.has(newMessage.id) // HERE IS ANOTHER WAY TO ADD: const sortedMessages = messages.reverse();
      );
      
      return {
        ...state,
        messages: [...uniqueMessages, ...state.messages].sort(
          (b, a) => new Date(b.Created) - new Date(a.Created)
        )
      };
    },

    setNewMessage: (state, action) => {
      if (!action.payload?.newMessage) {
        console.error("Invalid newMessage payload:", action.payload);
        return;
      }
      state.pendingMessagesFromBottom = state.pendingMessagesFromBottom + 1;

      state.messages.push({
        id: action.payload.newMessage.id,
        ChatId: action.payload.newMessage.chatId,
        Content: action.payload.newMessage.chatDescription,
        Created: action.payload.newMessage.Created,
        senderName: action.payload.newMessage.senderName,
        senderPic: action.payload.newMessage.senderProfilePicture,
        isImage: action.payload.newMessage.isImage,
        userSenderId: action.payload.newMessage.senderId,
      });
    },

    deleteMessageFromState: (state, action) => {
      if (!action.payload?.messageId) {
        console.error("Invalid newMessage payload:", action.payload);
        return;
      }
      const index = state.messages.findIndex((obj) => obj.id === action.payload.messageId);

      if(index !== -1){
        state.messages.splice(index, 1);
      }
    },

    updateMessageFromState: (state, action) => {
      if (!action.payload?.messageIdToUpdate) {
        console.error("Invalid newMessage payload:", action.payload);
        return;
      }
      const index = state.messages.findIndex((el) => el.id === action.payload.messageIdToUpdate);
      state.messages[index].Content = action.payload.messageContent;
    },

    setPendingMessagesFromBottomToZero: (state) => {
      state.pendingMessagesFromBottom = 0;
    }, /// KEEP ADDING NUMBERS TO CHAT COMPONENTS

    setNotifications: (state, action) => {
      state.notifications.push(action.payload.notifications);
    },

    /// THIS ONE INIATES WITH THE CHAT FETCHING (SETCHAT slice)
    setNumberOfNotificationsPerChat: (state, action) => {
      const notifications = action.payload.notifications;
      const notifMap = new Map();

      notifications.forEach((n) => {
        notifMap.set(n.chatId,n);
      })

      state.chats.forEach((chat) => {
        if(notifMap.has(chat.id)){
          chat.notificationsCount = notifMap.get(chat.id).unseenCount; 
        }
      });
    },
  ///

  ///THIS FUNCTION, RESETS "NOTIFICATIONSCount" PROPERTY WHEN THE USER GETS IN THE CHAT

  setUnseenNotificationsToZero: (state, action) => {
    const {chatId} = action.payload;
    const index = state.chats.findIndex((c) => c.id === chatId);
    if(index !== -1){
      state.chats[index].notificationsCount = 0;
    }
  },
  ///// THIS FUNCTION INCREMENTS THE NUMBER OF PENDING NOTIFICATIONS IN CASE THAT THE USER RECEIVES A UNREAD MESSAGE
  setIncrementeNumberOfUnreadNotifications: (state, action) => {
    const {notificationChatId} = action.payload;
    const index = state.chats.findIndex((c) => c.id === notificationChatId); 
    if (index !== -1) {
      ++state.chats[index].notificationsCount;
    }
  },

    setLastMessageToChat: (state, action) => {
      const { chatId, lastMessage, created, isImage, senderName, isGroupChat } = action.payload.LastMessage; 
      
      state.chats.forEach((chat) => {
        if (chat.id === chatId) {
          chat.LastMessage = isImage
            ? isGroupChat
              ? `${senderName}: 🖼️ IMAGE`
              : "🖼️ IMAGE"
            : isGroupChat
            ? `${senderName}: ${lastMessage}`
            : lastMessage;
          chat.LastMessageDate = created;
        }

        state.chats.sort((a, b) => new Date(b.LastMessageDate) - new Date(a.LastMessageDate));
      });
    },

    setDeleteAllMessagesFromState: (state) => {
      state.messages = [];
    },

    deleteKickedUserFromState: (state, action) => {
      const { kickedUserId } =  action.payload;
      const index = state.activeChat?.users?.findIndex((user) => user.UserId === kickedUserId);
      if(index !== -1){
        state.activeChat?.users?.splice(index, 1);
      }
    },

    removeNotifications: (state) => {
      state.notifications = [];
    },

    muteChat: (state, action) => {
      state.mutedChats.push(action.payload.mutedChat);
      localStorage.setItem("mutedChats", JSON.stringify(state.mutedChats));
    },

    unMuteChat: (state, action) => {
      const { mutedChatId } =  action.payload;
      const index = state.mutedChats.findIndex((chat) => chat.id  === mutedChatId);
      if(index !== -1){
        state.mutedChats.splice(index, 1);
        localStorage.setItem("mutedChats", JSON.stringify(state.mutedChats));
      }
    },

    toggleMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.darkMode));
    },

    fontSizeChange: (state, action) => {
      state.fontSize = action.payload.fontSize;
      localStorage.setItem("enableNotifications", JSON.stringify(state.fontSize));
    },
    setEnableNotifications: (state) => {
      state.enableNotifications = !state.enableNotifications;
      localStorage.setItem("enableNotifications", JSON.stringify(state.enableNotifications));
    }
  },
});

export const {
  setLogin,
  setLogOut,
  setChats,
  setActiveChat,
  setMessages,
  setNotifications,
  toggleMode,
  fontSizeChange,
  setEnableNotifications,
  muteChat,
  unMuteChat,
  removeNotifications,
  setNewMessage,
  setToUpdater,
  setPaginationMessages,
  setPendingMessagesFromBottomToZero,
  deleteMessageFromState,
  deleteKickedUserFromState,
  updateMessageFromState,
  setEmojisToUse,
  setNumberOfNotificationsPerChat,
  setUnseenNotificationsToZero,
  setLastMessageToChat,
  setDeleteAllMessagesFromState,
  setIncrementeNumberOfUnreadNotifications,
} = chatAppSlice.actions;

export default chatAppSlice.reducer;
