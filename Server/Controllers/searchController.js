import dotenv from "dotenv";
import { getMultipleUsers, getUser, searchUsersDB } from "../Model/users.js";
dotenv.config({ path: "./.env" });

export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const usersResult = await searchUsersDB(keyword);

    const FormatForFrontend = usersResult.map(
      ({ id, name, email,  ProfilePicture, Created, about }) => {
        return {
          id,
          name,
          email,
          ProfilePicture,
          Created,
          about,
        };
      }
    );
    return res.status(200).json(FormatForFrontend);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(500).json({ error: `Invalid ID` });
    }
    if (Array.isArray(userId)) {
      const usersResult = await getMultipleUsers(userId);

      const formatedUsers = usersResult.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          ProfilePicture: user.ProfilePicture,
          Created: user.Created,
          about: user.about,
        };
      });

      return res.status(200).json(formatedUsers);
    }

    const userResult = await getUser({ id: userId });
    if(!userResult){
      return res.status(404).json({error: "USER DOES NOT EXISTS"});
    }

    const formatedUser = {
      id: userResult.user.id,
      name: userResult.user.name,
      email: userResult.user.email,
      ProfilePicture: userResult.user.ProfilePicture,
      Created: userResult.user.Created,
      about: userResult.user.about,
    };
    return res.status(200).json(formatedUser);
  } catch (error) {
    return res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

