import { setActiveChat, setChats } from "../store/chatSlice.js";

export const getUserChats = async (id, dispatch, Token) => {
  try {
    const chatResults = await fetch(`http://localhost:3000/chat/get/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });

    const result = await chatResults.json();

    if (!result) {
      return { error: "Could not Find any related chats" };
    }


    return dispatch(setChats({ chats: result.chats }));
  } catch (error) {
    return { error: "something is wrong" };
  }
};


export const getChatInfo = async(id, dispatch, Token) => {
  try {
    const chatResults = await fetch(`http://localhost:3000/chat/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },   
    });

    const result = await chatResults.json();

    if (!result) {
      return { error: "Could not Find any related chats" };
    }
    dispatch(setActiveChat({ activeChat: result }));
    return result;
  } catch (error) {
    return { error: "something is wrong" };
  }
};


export const updateChatInfo = async(chatId, newChatName, newDescription, newChatImage,  Token, dispatch, currentChatImage) => {
  try {
    if (
      !chatId ||
      !newChatName ||
      newChatName.trim().length <= 1 || 
      !newDescription ||
      newDescription.trim().length <= 1 || 
      !Token
    ) {
      return { error: "Incomplete Parameters" };
    }
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("newChatName", newChatName);
    formData.append("newChatImage", newChatImage);
    formData.append("newDescription", newDescription);
    formData.append("currentChatImage", currentChatImage);

    const chatResults = await fetch(`http://localhost:3000/chat/edit`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: formData,
    });

    const result = await chatResults.json();

    if (!result) {
      return { error: "Could not Find any related chats" };
    }

    return dispatch(setActiveChat({activeChat: result}));
  } catch (error) {
    return { error: "Could not Find any related chats" };
  }
}


export const removeUserFromGroup = async (chatId, userId, Token) => {
  try {
    const chatResults = await fetch(`http://localhost:3000/chat/remove`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, userId }),
    });

    const result = await chatResults.json();

    if (!result) {
      return { error: "Could not Find any related chats" };
    }
    return result;

    
  } catch (error) {
    return { error: "Could not Find any related chats" };
  }
}


export const addUsersToGroup = async (chatId, usersId, Token) => {
  try {
    let arrString = JSON.stringify(usersId);
    const FRMData = new FormData();
    if(usersId.length === 0) return console.log("No users to add");
    FRMData.append("chatId", chatId);
    FRMData.append("usersId", JSON.stringify(arrString));
    const chatResults = await fetch(`http://localhost:3000/chat/add`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${Token}`,

      },
      body: FRMData,
    });

    const result = await chatResults.json();

    if (!result) {
      return { error: "Could not Find any related chats" };
    }

    return result;
  }
  catch (error) {
    return { error: "Could not Find any related chats" };
  }
}

export const deleteAllMessagesFromChat = async(chatId, chatAdminId, Token) => {
  try {
    const FRMData = new FormData();
    FRMData.append("chatId", chatId);
    FRMData.append("chatAdminId", chatAdminId);

    const response = await fetch(`http://localhost:3000/chat/deleteAllMessages`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: FRMData,
    })

    const result = await response.json();

    return result;

  
  } catch (error) {
    return { error: "SOMETHING WENT WRONG" };
  }
}

export const deleteEntireChat = async(chatId, chatAdminId, Token) => {
  try {
    const FRMData = new FormData();
    FRMData.append("chatId", chatId);
    FRMData.append("chatAdminId", chatAdminId);

    const response = await fetch(`http://localhost:3000/chat/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: FRMData,
    })

    const result = await response.json();

    return result;
    
  
  } catch (error) {
    return { error: "SOMETHING WENT WRONG" };
  }
}