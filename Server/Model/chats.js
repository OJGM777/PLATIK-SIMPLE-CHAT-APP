import { pool } from "./index.js";

export const createChat = async (obj, userOne, userTwo) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // Iniciar transacción

    // Crear el chat
    const createChatQuery = `
        INSERT INTO Chats (id, ChatName, ChatImage, description, isGroupChat, ChatAdmin) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    await connection.execute(createChatQuery, [
      obj.id,
      obj.ChatName,
      obj.ChatImage,
      obj.description,
      false, // DUAL chat
      obj.ChatAdmin,
    ]);

    // Generar IDs de los usuarios fuera del array
    const userOneId = crypto.randomUUID();
    const userTwoId = crypto.randomUUID();

    // Insertar usuarios en la tabla Users_Chats
    const insertUsersQuery = `
        INSERT INTO Users_Chats (id, ChatId, UserId, UserRole) 
        VALUES (?, ?, ?, ?), (?, ?, ?, ?)
      `;
    await connection.execute(insertUsersQuery, [
      userOneId,
      obj.id,
      userOne,
      "Admin",
      userTwoId,
      obj.id,
      userTwo,
      "Admin", 
    ]);

    // Obtener los datos del chat recién creado
    const [chatData] = await connection.execute(`SELECT * FROM Chats WHERE id = ?`, [obj.id]);

    await connection.commit(); // Confirmar cambios

    return chatData[0]; // Solo devolver el chat creado
  } catch (error) {
    await connection.rollback(); // Revertir cambios si hay error
    console.error("Error creando el chat:", error);
    throw new Error("No se pudo crear el chat.");
  } finally {
    connection.release();
  }
};

export const getChat = async (obj) => {
  const connection = await pool.getConnection();
  try {
    const getQuery = `
      SELECT c.id AS chatId, c.ChatName, c.ChatImage, c.description, c.isGroupChat, 
      c.ChatAdmin, c.Created, uc.UserId, uc.UserRole, u.name, u.ProfilePicture  
      FROM Chats c 
      LEFT JOIN Users_Chats uc ON c.id = uc.ChatId 
      LEFT JOIN Users u ON uc.UserId = u.id
      WHERE c.id = ?;`;

    const [rows] = await connection.execute(getQuery, [obj.id]);

    if (rows.length < 1) {
      return undefined;
    }

    const chatData = {
      id: rows[0].chatId,
      ChatName: rows[0].ChatName,
      ChatImage: rows[0].ChatImage,
      description: rows[0].description,
      isGroupChat: rows[0].isGroupChat,
      ChatAdmin: rows[0].ChatAdmin,
      Created: rows[0].Created,
    };

    const users = rows
      .map((row) => ({
        UserId: row.UserId,
        UserRole: row.UserRole,
        name: row.name,
        ProfilePicture: row.ProfilePicture,
      }))
      .filter((user) => user.UserId);

    return {
      success: true,
      data: chatData,
      users: users,
    };
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
};



export const getUsersFromChat = async (chatId) => { //Used Only on chat (maybe implement later on client)
  const connection = await pool.getConnection();
  try {
    const getQuery = `SELECT UserId AS id FROM Users_Chats WHERE ChatId = ?`;
    const [rows] = await connection.execute(getQuery, [chatId]);
    if(rows < 1){
      return {error: "Chat does not Have Users or does not exists"}
    }

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
  finally{
    connection.release(); // DAMN
  }
}


export const findOneToOneChat = async (obj) => {
  const connection = await pool.getConnection();
  try {
    const query = `
    SELECT uc.ChatId
    FROM Users_Chats uc
    JOIN Chats c ON uc.ChatId = c.id
    WHERE uc.UserId IN (?, ?)
    AND c.isGroupChat = FALSE
    GROUP BY uc.ChatId
    HAVING COUNT(DISTINCT uc.UserId) = 2;
    `;

    const [result] = await connection.execute(query, [
      obj.userIdOne,
      obj.userIdTwo,
    ]);

    if (result.length > 0) {
      return {
        success: true,
        ChatId: result[0].ChatId,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
};

export const getChatsByUserId = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getQuery = `SELECT 
    c.*, 
    u.ProfilePicture AS altChatImage,
    CASE
        WHEN SUBSTRING_INDEX(c.ChatImage, ' | ', 1) != ? THEN SUBSTRING_INDEX(c.ChatImage, ' | ', 1)
        ELSE SUBSTRING_INDEX(c.ChatImage, ' | ', -1)
    END AS OtherUserId
FROM Users_Chats uc
LEFT JOIN Chats c ON uc.ChatId = c.id
LEFT JOIN Users u ON u.id = 
    (CASE
        WHEN SUBSTRING_INDEX(c.ChatImage, ' | ', 1) != ? THEN SUBSTRING_INDEX(c.ChatImage, ' | ', 1)
        ELSE SUBSTRING_INDEX(c.ChatImage, ' | ', -1)
    END)
WHERE uc.UserId = ?;`;

    const [result] = await connection.execute(getQuery, [id, id, id]);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error(error);
  } finally {
    connection.release();
  }
};

//// GROUP CHATS FUNCTIONS

export const createGroupChat = async (obj, users) => {
  const connection = await pool.getConnection();
  try {
    // CREATE GROUP
    await connection.beginTransaction()
    const query = `INSERT INTO Chats (id,ChatName, ChatImage, description, isGroupChat, ChatAdmin) VALUES (?, ?, ?, ?, ?, ?)`;

    await connection.execute(query, [
      obj.id,
      obj.ChatName,
      obj.ChatImage,
      obj.description,
      true, // group chat
      obj.ChatAdmin,
    ]);

    //INSERT USER INTO RELATIONAL TABLE
    const insertQuery = `INSERT INTO Users_Chats (id, ChatId, UserId, UserRole) VALUES ${users
      .map((u) => "(?,?,?,?)")
      .join(",")}`;

    const values = users.flatMap((user) => [
      crypto.randomUUID(),
      obj.id,
      user,
      user == obj.ChatAdmin ? "Admin" : "Member",
    ]); // PLANNING TO CHANGE THIS WAY OF INSERTING DATA!!!!

    await connection.execute(insertQuery, values);

    const finalresult = await getChat({ id: obj.id });
    connection.commit();
    return finalresult;
  } catch (error) {
    await connection.rollback();
    console.error(error);
  } finally {
    connection.release();
  }
};

export const updateGroupChatInfo = async (id, data) => {
  const connection = await pool.getConnection();
  try {
    const query = `UPDATE Chats SET ChatName = ?,  ChatImage = ?, description = ? WHERE id = ?`;

    await connection.execute(query, [
      data.newChatName,
      data.newImage,
      data.newDescription,
      id,
    ]);

    const finalresult = await getChat({ id: id });
    return finalresult;
  } catch (error) {
    await connection.rollback();
    console.error(error);
  } finally {
    connection.release();
  }
};

export const removeUserFromGroup = async (data) => {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM Users_Chats WHERE ChatId = ?  AND UserId = ?`;
    await connection.execute(query, [data.chatId, data.userId]);
    const finalresult = await getChat({ id: data.chatId });
    return finalresult;
  } catch (error) {
    await connection.rollback();
    console.error(error);
  } finally {
    connection.release();
  }
};

export const addUserToGroup = async (data) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getQuery = `INSERT INTO Users_Chats (id, ChatId, UserId, UserRole) VALUES ${data.usersId
      .map((u) => "(?,?,?,?)")
      .join(",")}`;

    const values = data.usersId.flatMap((user) => [
      crypto.randomUUID(),
      data.chatId,
      user,
      "Member",
    ]);

    await connection.execute(getQuery, values);
    await connection.commit();
    const finalresult = await getChat({ id: data.chatId });
    return finalresult;
  } catch (error) {
    await connection.rollback();
    console.error(error);
  } finally {
    connection.release();
  }
};

export const deleteAllMessagesFromChatById = async(obj) => {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE from Messages WHERE ChatId = ?;`;

    await connection.execute(query, [obj.id])

    return {deleted: true, chatId: obj.id};


  } catch (error) {
    await connection.rollback();
    console.error(error);
  }
  finally {
    connection.release();
  } 
}

export const deleteEntireChatById = async(obj) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const deleteMessagesQuery = `DELETE FROM Messages WHERE ChatId = ?`;
    const deleteUsersFromChatQuery = `DELETE FROM Users_Chats WHERE ChatId = ?`;
    const deleteChatQuery = `DELETE FROM Chats WHERE id = ?`;
    
    await connection.query(deleteMessagesQuery, [obj.id]);
    await connection.query(deleteUsersFromChatQuery, [obj.id]);
    await connection.query(deleteChatQuery, [obj.id]);

    await connection.commit();

    return {deleted: true, chatId: obj.id};

  } catch (error) {
    await connection.rollback();
    console.error(error);
  }
  finally{
    connection.release();
  }
}
