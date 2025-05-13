import { pool } from "./index.js";

export const upsertNotifications = async (
  userId,
  chatId,
  message,
  chatImage,
  chatName,
  isImage,
  senderName,
  isGroupChat
) => {
  if (userId.length === 0) return;

  const connection = await pool.getConnection();
  try {
    const query = `
    INSERT INTO Notifications (id, userId, chatId, message, chatImage, chatName, unseenCount, senderName)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    ON DUPLICATE KEY UPDATE 
      message = VALUES(message),
      chatImage = VALUES(chatImage),
      chatName = VALUES(chatName),
      unseenCount = unseenCount + 1,
      lastUpdated = CURRENT_TIMESTAMP,
      senderName = VALUES(senderName)
  `;
    const content = isImage
      ? "IMAGE"
      : isGroupChat
      ? `${senderName}: ${message}`
      : message;

    const values = [
      crypto.randomUUID(),
      userId[0],
      chatId,
      content,
      chatImage,
      chatName,
      senderName,
    ];
    await connection.execute(query, values);
  } catch (error) {
    console.error("❌ Error al insertar notificación:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const getNotificationsFromDB = async (userId, limit, offset) => {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM Notifications WHERE userId = ? ORDER BY lastUpdated DESC LIMIT ? OFFSET ?`;

    const [notifications] = await connection.execute(query, [
      userId,
      limit,
      offset,
    ]);
    console.log("RESULT: ", notifications);
    return notifications;
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
};

export const deleteAllTheRelatedNotificationsFromDB = async (
  userId,
  chatId
) => {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM Notifications WHERE UserId = ? AND ChatId = ?`;
    await connection.execute(query, [userId, chatId]);
    return { message: "Notifications related To the chat were Deleted" };
  } catch (error) {
    console.error(error);
    return { error: "Something went Wrong" };
  } finally {
    connection.release();
  }
};

// \n
