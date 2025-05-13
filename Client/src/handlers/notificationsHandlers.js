import { deleteNotificationsFromChat, getUserNotifications } from "../API/notificationsCalls";
import { setNumberOfNotificationsPerChat } from "../store/chatSlice";

export const handleDeleteNotificationsFromChat = (userId, chatId, tokenInfo) => {
  deleteNotificationsFromChat(userId, chatId, tokenInfo); /// Separating the API call (in case a new feature is added)
};


export const handleSetNotifications = async(userId, limit, offset, tokenInfo, dispatch) => {
  try {
    const notificationsToSet = await getUserNotifications(userId, limit, offset, tokenInfo); 
    if(notificationsToSet.notifications.length < 1) return;
    dispatch(setNumberOfNotificationsPerChat({notifications: notificationsToSet.notifications}))
    
  } catch (error) {
    console.log(error);
  }
};
