import { deleteImageFromImageHost, uploadImage } from "../Middleware/CloudinaryIMGuploader.js";
import { createMessage, deleteMessageById, getMessageById, getMessagesFromChatId, updateMessageById } from "../Model/messages.js";


export const createAndSendMessages = async (req, res) => {
  try {
    const { chatId, messageContent, senderId } = req.body;

    if (!chatId || !messageContent || !senderId) {
      return res.status(401).json({ message: "Incomplete Parameters" });
    }

    const id = crypto.randomUUID();

    const result = await createMessage({
      id,
      chatId,
      messageContent,
      senderId,
      isImage: false,
    });
    
    res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `from message Controller: ${error.message}` });
  }
};


export const createAndSendImage = async (req,res) => {
  try {
    const {chatId, senderId} = req.body;
    if (!chatId || !senderId) {
      return res.status(401).json({ message: "Incomplete Parameters" });
    }
    const id = crypto.randomUUID();

    let uploadedIMG = null;
    const image = req.file ? req.file.path : null;

    if(!image){
      return res.status(400).json({ error: `from message Controller: ${error.message}` });
    }

    uploadedIMG =  await uploadImage(image);

    const result = await createMessage({
      id,
      chatId,
      messageContent: uploadedIMG.url,
      senderId,
      isImage: true,
    })

    res.status(200).json(result);


  } catch (error) {
    return res
      .status(500)
      .json({ error: `from message Controller: ${error.message}` });
  }
}



export const deleteMessage = async (req,res) => {
  try {
    const {messageId} = req.params;

    if(!messageId || messageId === undefined){
      return res.status(401).json({error: "ID NOT DEFINED"});
    }

    let matchAndExists = await getMessageById({messageId});

    if(!matchAndExists || matchAndExists.length < 1){
      return res
      .status(404)
      .json({ error: `Message Not Found` });
    }

    if(matchAndExists.isImage){
      const deletedImage = await deleteImageFromImageHost(matchAndExists.Content);
      console.log(deletedImage);
    }


    const result = await deleteMessageById({messageId: messageId});

    res.status(200).json(result)



  } catch (error) {
    return res
    .status(500)
    .json({ error: `from message Controller: ${error.message}` });
  }
}


export const updateMessage = async (req,res) => {
  try {
    const {messageId, contentToUpdate} = req.body;

    if(!messageId || messageId === undefined){
      return res.status(401).json({error: "ID NOT DEFINED"});
    }

    let matchAndExists = await getMessageById({messageId});

    if(!matchAndExists || matchAndExists.length < 1){
      return res
      .status(404)
      .json({ error: `Message Not Found` });
    }

    const result = await updateMessageById({messageId, contentToUpdate});

    return res.status(200).json(result);

  } catch (error) {
    return res
    .status(500)
    .json({ error: `from message Controller: ${error.message}` });
  }
}


export const getMessagesFromChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const {offset, limit} = req.query;

    if (!chatId || chatId === undefined) {
      return res.status(400).json({ error: "ID NOT DEFINED" });
    }

    const messages = await getMessagesFromChatId({ chatId, offset, limit });

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `from MessageController: ${error.message}` });
  }
};
