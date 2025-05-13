export const getUser = async (id, Token) => {
  try {
    const userResult = await fetch(`http://localhost:3000/user/get?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });

    const result = await userResult.json();

    return result;
  } catch (error) {
    return { error: "something is wrong" };
  }
};

export const updateUserInfo = async (
  userId,
  name,
  about,
  newProfilePicture,
  profilePicture,
  Token
) => {
  try {
    if (
      !userId ||
      !name ||
      name.trim().length <= 1 ||
      !about ||
      about.trim().length <= 1 || 
      !Token
    ) {
      return { error: "Incomplete Parameters" };
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", name);
    formData.append("about", about);
    formData.append(
      "newProfilePicture",
      newProfilePicture === null ? profilePicture : newProfilePicture
    );
    formData.append("currentProfilePicture", profilePicture); 

    const userResult = await fetch("http://localhost:3000/user/edit", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: formData,
    });

    const result = await userResult.json();

    return result;
  } catch (error) {
    return { error: "something is wrong" };
  }
};

export const deleteEntireUser = async (userId, token) => {
  try {
    const response = await fetch(`http://localhost:3000/user/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return { error: "something is wrong" };
  }
};
