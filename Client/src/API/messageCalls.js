import { setMessages } from "../store/chatSlice";

export const createAndSendMessage = async (
  chatId,
  messageContent,
  senderId,
  token
) => {
  try {
    const FRMdata = new FormData();
    FRMdata.append("chatId", chatId);
    FRMdata.append("messageContent", messageContent);
    FRMdata.append("senderId", senderId);

    const savedMessage = await fetch("http://localhost:3000/message/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: FRMdata,
    });

    if (!savedMessage.ok) {
      return savedMessage.json();
    }

    if (savedMessage.ok) {
      return await savedMessage.json();
    }
  } catch (error) {
    console.log(error);
  }
};

export const createAndSendImage = async (
  chatId,
  NewMessageImage,
  senderId,
  token
) => {
  try {
    const FRMdata = new FormData();
    FRMdata.append("chatId", chatId);
    FRMdata.append("NewMessageImage", NewMessageImage );
    FRMdata.append("senderId", senderId);

    const savedImage = await fetch("http://localhost:3000/message/send/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: FRMdata
    });

    if (!savedImage.ok) {
        return savedImage.json();
    }

    if (savedImage.ok) {
        return await savedImage.json();
    }


  } catch (error) {
    console.log(error);
  }
};


export const deleteMessageById = async(messageId, token) => {
  try {

    const messageToDelete = await fetch(`http://localhost:3000/message/delete/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if(!messageToDelete.ok){
      return await messageToDelete.json();
    }

    const result = await messageToDelete.json();

    return result;
    
  } catch (error) {
    console.log(error);
  }

}

export const updateMessageById = async(messageId, contentToUpdate, token) => {
  try {
    const FRMdata = new FormData();
    FRMdata.append("messageId", messageId);
    FRMdata.append("contentToUpdate", contentToUpdate);

    const messageToUpdate = await fetch(`http://localhost:3000/message/update`, 
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: FRMdata,
      }
     )

     if(!messageToUpdate.ok){
      return await messageToUpdate.json()
     }

     const result = await messageToUpdate.json();

     return result;




  } catch (error) {
    console.log(error);
  }
}

export const getMessagesFromChat = async (chatId, dispatch, token, offset) => {
  try {
    const params = new URLSearchParams({
      offset: offset, // Comienza desde el mensaje 0
      limit: 50, // Número de mensajes a cargar
    });
    const url = `http://localhost:3000/message/get/${chatId}?${params.toString()}`;
    const messagesData = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (messagesData.length < 1) {
      return { message: "NOT MESSAGES FOUNDED" };
    }

    if (!messagesData.ok) {
      return await messagesData.json();
    }

    const result = await messagesData.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};
