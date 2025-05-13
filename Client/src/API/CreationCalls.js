

export const createGroupChat = async (
  groupName,
  users,
  description,
  image,
  chatCreator,
  Token
) => {
  try {

    let arrString = JSON.stringify(users);
    const FRMData = new FormData();
    FRMData.append("chatName", groupName);
    FRMData.append("chatDescription", description);
    FRMData.append("chatImage", image);
    FRMData.append("users", JSON.stringify(arrString));
    FRMData.append("chatCreator", chatCreator);

    const savedChatData = await fetch("http://localhost:3000/chat/group", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: FRMData,
    });

    if (!savedChatData.ok) {
      return savedChatData.json();
    }

    if (savedChatData.ok) {
      return { message: "Chat created Succesfully" };
    }
  } catch (error) {
    console.log(error);
  }
};

export const createOneToOneChat = async (id, userId, Token) => {
  try {
    const FRMData = new FormData();
    FRMData.append("id", id);
    FRMData.append("userId", userId);

    const savedChatData = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: FRMData,
    });

    if (!savedChatData.ok) {
      return await savedChatData.json();
    }

    if (savedChatData.ok) {
      return await savedChatData.json();
    }
  } catch (error) {
    console.log(error);
  }
};
