import { deleteImageFromImageHost, updateImage, uploadImage } from "../Middleware/CloudinaryIMGuploader.js";
import { getUser } from "../Model/users.js";

import {
  addUserToGroup,
  createChat,
  createGroupChat,
  deleteAllMessagesFromChatById,
  deleteEntireChatById,
  findOneToOneChat,
  getChat,
  getChatsByUserId,
  removeUserFromGroup,
  updateGroupChatInfo,
} from "../Model/chats.js";

export const accessOneToOneChat = async (req, res) => {
  try {
    const { id, userId } = req.body;

    if (!userId || !id) {
      return res
        .status(404)
        .json({ error: "Incomplete Parameters" + " " + id + " " + userId });
    }

    if (userId === id) {
      return res.status(404).json({ error: "Invalid Id's" });
    }

    const matchAndExists = await findOneToOneChat({
      userIdOne: id,
      userIdTwo: userId,
    });

    if (matchAndExists.success) {
      const chat = await getChat({ id: matchAndExists.ChatId });
      return res.status(200).json({ exists: true, chatData: chat.data});
    }
    //IF CHAT DOES NOT EXIST WE CREATE A NEW ONE
    else {
      const userOne = await getUser({ id: id });
      const userTwo = await getUser({ id: userId });

      console.log(userOne, userTwo);

      if (!userOne.user || !userTwo.user)
        return res.status(200).json({ message: "User does not Exists" });


      const chatId = crypto.randomUUID();

      const createdChat = await createChat(
        {
          id: chatId,
          ChatName: `${userOne.user.name} and ${userTwo.user.name}`,
          ChatImage: `${userOne.user.id} | ${userTwo.user.id}`, // to get the image of each member separately
          description: `Dual Chat of ${userOne.user.name} and ${userTwo.user.name}`,
          ChatAdmin: userOne.user.id,
        },
        userOne.user.id,
        userTwo.user.id
      );

      return res.status(200).json(createdChat);
    }
  } catch (error) {
    res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(404)
        .json({ error: "Incomplete Parameters" + " " + id });
    }

    const chats = await getChatsByUserId(id);

    res.status(200).json({ status: 200, chats });
  } catch (error) {
    res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

/// GROUP CHAT FUNCTIONS

export const createGroupChats = async (req, res) => {
  try {
    const { chatName, chatImage, chatDescription, chatCreator, users } =
      req.body;

    const formatedUsers = JSON.parse(users || "[]");

    if (!chatName || !chatCreator || !users || formatedUsers.length < 2) {
      return res.status(401).json({ error: "Incomplete Parameters" });
    }

    const hasRepeated = () => {
      const set = new Set(users);
      return set.size == users.length;
    };

    const isRepeated = hasRepeated();

    if (isRepeated) {
      return res
        .status(401)
        .json({ error: "BAD ID REQUEST (DON'T REPEAT ID'S)" });
    }

    // IMG UPLOADING
    let uploadedIMG = null;
    const Picture = req.file ? req.file.path : null;

    if (Picture) {
      uploadedIMG = await uploadImage(Picture);
    }
    //////

    const result = await createGroupChat(
      {
        id: crypto.randomUUID(),
        ChatName: chatName,
        ChatImage: uploadedIMG
          ? uploadedIMG.url
          : "https://cdn-icons-png.flaticon.com/512/1384/1384309.png",
        description: chatDescription,
        ChatAdmin: chatCreator,
      },
      JSON.parse(formatedUsers)
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: `${error.message}` });
  }
};


//CREATE FUNCTION THAT RETURNS CHAT INFO

export const getChatInfo = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Incomplete Parameters" });
    }

    const chat = await getChat({ id });

    res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
}

export const editChatInfo = async (req, res) => {
  try {
    const { chatId, newChatName, newChatImage, newDescription, currentChatImage } = req.body;

    console.log(req.body);

    if (!chatId ||  chatId === undefined ||  chatId === 'undefined' || !newChatName || !newDescription) {
      return res.status(401).json({ message: "Incomplete Parameters" });
    }

    // IMG UPLOADING
    let updatedImage = null;
    const Picture = req.file ? req.file.path : null;

    if (Picture) {
      updatedImage = await updateImage(Picture, currentChatImage);
    }
    //////


    const result = await updateGroupChatInfo(chatId, {
      newChatName,
      newImage: updatedImage ? updatedImage.data.url : newChatImage,
      newDescription,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
};



export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      return res.status(401).json({ message: "Incomplete Parameters" });
    }

    const result = await removeUserFromGroup({ chatId, userId });

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

export const addToGroup = async (req, res) => {
  try {
    const { chatId, usersId } = req.body;
    const formatedUsers = JSON.parse(usersId || "[]");
    if (!chatId || !usersId) {
      return res.status(401).json({ message: "Incomplete Parameters" });
    }

    const result = await addUserToGroup({ chatId, usersId: JSON.parse(formatedUsers) });

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

export const deleteAllMessagesFromChat = async (req,res) => {
  try {
    const {chatId, chatAdminId} = req.body;

    if(!chatId || !chatAdminId){
      return res.status(401).json({ error: "Incomplete Parameters" });
    }

    const verifyAdmin = await getChat({id: chatId});
    if(verifyAdmin.data?.ChatAdmin !== chatAdminId){
      return res.status(500).json({ error: `from auth: INVALID ACCESS` });
    }

     const result = await deleteAllMessagesFromChatById({id: chatId});

     res.status(200).json(result);



  } catch (error) {
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
}


export const deleteEntireChat = async (req,res) => {
  try {

    const {chatId, chatAdminId} = req.body;

    if(!chatId || !chatAdminId){
      return res.status(401).json({ error: "Incomplete Parameters" });
    }

    const verifyAdmin = await getChat({id: chatId});
    if(verifyAdmin.data?.ChatAdmin !== chatAdminId){
      return res.status(500).json({ error: `from Chats: INVALID ACCESS` });
    }

    if(verifyAdmin.data.isGroupChat){
      const deletedResult = await deleteImageFromImageHost(verifyAdmin.data.ChatImage);
      console.log(deletedResult);
    }

    const result = await deleteEntireChatById({id: chatId});
    res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: `from Chats: ${error.message}` });
  }
}
