


export const searchUser = async (keyword, Token) => {
  try {
    const result = await fetch(
      `http://localhost:3000/user/search?keyword=${keyword} `,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`
       }
      }
    );

    const users = await result.json();
    return users;
  } catch (error) {
    return {error: "something is wrong"};
  }
};
