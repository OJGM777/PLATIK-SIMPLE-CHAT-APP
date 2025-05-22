export const getUserNotifications = async (userId, limit, offset, Token) => {
  try {
    const result = await fetch(
      `http://localhost:3000/notifications/get/${userId}?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );

    if (!result.ok) {
      return await result.json();
    }

    const notificationsResult = await result.json();

    return notificationsResult;
  } catch (error) {
    console.error("Error While Getting Notifications:", error);
  }
};

export const deleteNotificationsFromChat = async (userId, chatId, Token) => {
  try {
    await fetch(
      `http://localhost:3000/notifications/delete/${userId}/${chatId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    return;
  } catch (error) {
    console.error("Error While deleting Notifications:", error);
  }
};

