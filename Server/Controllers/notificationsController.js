import { getUsersFromChat } from "../Model/chats.js";
import {
  deleteAllTheRelatedNotificationsFromDB,
  getNotificationsFromDB,
  upsertNotifications,
} from "../Model/notifications.js";
import notificationsQueue from "../Queue/notificationQueue.js";
import { connectedUsers } from "../socketHandlers.js";


const getConnectedUsers = async (chatId) => {
  const chatMembers = await getUsersFromChat(chatId);

  const onlineUsersInChat = new Set();
  for (const [userId, data] of connectedUsers.entries()) {
    if (data.activeChatId === chatId) {
      onlineUsersInChat.add(userId);
    }
  }

  return chatMembers
    .filter(member => !onlineUsersInChat.has(member.id))
    .map(member => member.id);
};

export const sendNotifications = async (pendingMessage) => {
  try {
    const usersToNotify = await getConnectedUsers(pendingMessage.chatId);
    if (usersToNotify.length === 0) {
      console.log("📭 No users to notify");
      return;
    }


    for (const userId of usersToNotify) {
      notificationsQueue.add(async () => {
        try {
          await upsertNotifications(
            [userId],
            pendingMessage.chatId,
            pendingMessage.chatDescription,
            pendingMessage.chatImage,
            pendingMessage.chatName,
            pendingMessage.isImage,
            pendingMessage.senderName,
            pendingMessage.isGroupChat
          );
        } catch (error) {
          console.error(`❌ Error al notificar a ${userId}:`, error);
        }
      });
    };
    
  } catch (error) {
    console.error("💥 Error en sendNotifications:", error);
  }
};


export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, offset } = req.query;
    if (!userId || !offset || !limit) {
      return res.status(400).json({
        error: "INVALID DATA" + "" + userId + " " + limit + " " + offset,
      });
    }

    const notifications = await getNotificationsFromDB(userId, limit, offset);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `from Notifications Controller: ${error.message}` });
  }
};

export const deleteAllTheRelatedNotifications = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    if (!userId || !chatId) {
      return res.status(400).json({ error: "INVALID DATA" + "" + userId + " " + chatId });
    }

    const result = await deleteAllTheRelatedNotificationsFromDB(userId, chatId);

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `from Notifications Controller: ${error.message}` });
  }
};
