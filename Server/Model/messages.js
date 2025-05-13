import { pool } from "./index.js";

export const createMessage = async (obj) => {
  const connection = await pool.getConnection();

  try {
    const { id, chatId, messageContent, senderId, isImage } = obj;

    const query = `INSERT INTO Messages (id, ChatId, Content, userSenderId, isImage) VALUES (?, ?, ?, ?, ?)`;
    await connection.execute(query, [
      id,
      chatId,
      messageContent,
      senderId,
      isImage,
    ]);

    const finalResult = await getMessageById({ messageId: id });

    const message = isImage
      ? finalResult.isGroupChat
        ? `${finalResult.senderName}: IMAGE`
        : "IMAGE"
      : finalResult.isGroupChat
      ? `${finalResult.senderName}: ${finalResult.Content}`
      : finalResult.Content;

    const updateQuery = `UPDATE Chats SET LastMessage = ?,LastMessageDate = ? WHERE id = ?`;
    await connection.execute(updateQuery, [
      message,
      finalResult.Created,
      chatId,
    ]);

    return finalResult;
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

export const deleteMessageById = async (obj) => {
  const connection = await pool.getConnection();

  try {
    const { messageId } = obj;
    const query = `DELETE FROM Messages WHERE id = ?`;
    await connection.execute(query, [messageId]);

    return {message: "Message Deleted Successfully! with id: " + messageId, status: 200 };
  
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

export const updateMessageById = async (obj) => {
  const connection = await pool.getConnection();
  try {
    const {messageId, contentToUpdate} = obj;
    
    const query = `UPDATE Messages SET Content = ? WHERE id = ?`;
    await connection.execute(query, [ contentToUpdate, messageId]);

    return {message: "Message Updated Successfully with id: " + messageId, status: 200};

  } catch (error) {
    console.log(error);
  }
  finally{
    connection.release();
  }
};

export const getMessageById = async (obj) => {
  const connection = await pool.getConnection();

  try {
    const { messageId } = obj;

    const getQuery = `SELECT m.*, c.isGroupChat, u.name as senderName, u.profilePicture as senderPic 
    FROM Messages m 
    LEFT JOIN Users u 
    ON m.usersenderId = u.id 
    LEFT JOIN Chats c
    ON m.ChatId = c.id
    WHERE m.id = ?;`;

    const [message] = await connection.execute(getQuery, [messageId]);

    return message[0];
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

export const getMessagesFromChatId = async (obj) => {
  const connection = await pool.getConnection();

  try {
    const { chatId, offset, limit } = obj;
    console.log(offset, limit); // 0 50
    const getQuery = `SELECT m.*, u.name as senderName, u.ProfilePicture as senderPic FROM Messages m LEFT JOIN Users u ON m.userSenderId = u.id WHERE m.ChatId = ? ORDER BY m.Created DESC LIMIT ? OFFSET ?`;

    const [messages] = await connection.execute(getQuery, [
      chatId,
      limit,
      offset,
    ]);

    return messages;
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};
