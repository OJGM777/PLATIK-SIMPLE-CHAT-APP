import { pool } from "./index.js";

export const registerUser = async (
  id,
  name,
  email,
  password,
  profilePicture,
  about
) => {
  const connection = await pool.getConnection();
  try {
    const query = `INSERT INTO Users (id, name, email, password, ProfilePicture, about) values(?, ?, ?, ?, ?, ?)`;

    const [result] = await connection.execute(query, [
      id,
      name,
      email,
      password,
      profilePicture,
      about,
    ]);
    //////

    ///GET INSERTED DATA FROM DB
    const getQuery = `SELECT * FROM Users WHERE id = ?`;
    const [rows] = await connection.execute(getQuery, [id]);
    ///

    return {
      dataResult: result,
      user: rows[0],
    };
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

export const getMultipleUsers = async (obj) => {
  const connection = await pool.getConnection();
  try {
    const placeholders = obj.map(() => "?").join(", ");
    const getQuery = `SELECT * FROM Users WHERE id IN (${placeholders})`;

    const [rows] = await connection.execute(getQuery, ids);

    if(rows.length < 1){
      return null;
    }

    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

export const getUser = async (obj) => {
  const connection = await pool.getConnection();
  try {
    ///THIS SECTION IS TO GET THE USER BY ITS EMAIL
    if (obj.email) {
      const getQuery = `SELECT * FROM Users WHERE email = ?`;
      const [rows] = await connection.execute(getQuery, [obj.email]);

      if(rows.length < 1){
        return null;
      }

      return rows
    }
    //////////

    // THIS SECTIONS IS TO GET THE USER BY ITS ID
    if (obj.id) {
      const getQuery = `SELECT name, Created, ProfilePicture, about, email, id FROM Users WHERE id = ?`;
      const [rows] = await connection.execute(getQuery, [obj.id]);

      if(rows.length < 1){
        return null;
      }

      return {
        success: true,
        user: rows[0],
      };
    }

    /////
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

export const searchUsersDB = async (keyword) => {
  const connection = await pool.getConnection();
  try {
    const searchPattern = `%${keyword}%`;
    const getQuery = `SELECT * FROM Users WHERE email LIKE ?`;
    const [rows] = await connection.execute(getQuery, [searchPattern]);

    return rows;
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
};

export const updateUserInfo = async (userId, obj) => {
  const connection = await pool.getConnection();
  try {
    const { name, about, newImage } = obj;
    const query = `UPDATE Users SET name = ?, about = ?, ProfilePicture = ? WHERE id = ?`;

    const [result] = await connection.execute(query, [
      name,
      about,
      newImage,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "User not found",
      };
    } else {
      const finalresult = await getUser({ id: userId });
      return {
        success: true,
        user: finalresult.user,
      };
    }
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};


export const deleteUserById = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const deleteMessagesQuery = `DELETE FROM Messages WHERE userSenderId = ?`;
    const deleteUserFromChats = `DELETE FROM Users_Chats WHERE UserId = ?`;
    const deleteUser = `DELETE FROM Users WHERE id = ?`;

    //THIS SECTION IS USE TO CHANGE HIS ROLE AND ASSIGN OTHER ADMIN TO ITS GROUPS;

    const [groups] = await connection.execute(`SELECT id FROM Chats WHERE ChatAdmin = ?`, [userId] );
  
    for(const group of groups){

      const [newAdmin] = await connection.execute(`SELECT UserId FROM Users_Chats WHERE ChatId = ? AND userId != ? ORDER BY JoinedDate ASC LIMIT 1`, [group.id, userId]);
      console.log(newAdmin);

      if(newAdmin.length > 0){
         await connection.execute(`UPDATE Chats SET ChatAdmin = ? WHERE id = ?`, [newAdmin[0].UserId, group.id]);
      }
      else{
         await connection.execute(`DELETE FROM Chats WHERE id = ?`, [group.id]);
      }
    }

    /////
    await connection.execute(deleteMessagesQuery, [userId]);
    await connection.execute(deleteUserFromChats, [userId]);
    await connection.execute(deleteUser, [userId]);

    return {deleted: true, user: userId};


  } catch (error) {
    console.log(error);
  }
  finally {
    connection.release();
  }
}
