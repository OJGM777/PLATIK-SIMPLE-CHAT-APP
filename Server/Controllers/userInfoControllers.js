import {
  deleteImageFromImageHost,
  updateImage,
} from "../Middleware/CloudinaryIMGuploader.js";
import { deleteUserById, getUser, updateUserInfo } from "../Model/users.js";

export const editUserInfo = async (req, res) => {
  try {
    const { userId, name, about, newProfilePicture, currentProfilePicture } =
      req.body;
    if (!userId || !name || !about) {
      return res
        .status(401)
        .json({
          message: "FROM UPDATE: Incomplete Parameters",
          data: {
            userId,
            name,
            about,
            newProfilePicture,
            currentProfilePicture,
          },
        });
    }


    // IMG UPLOADING
    let updatedImage = null;
    const Picture = req.file ? req.file.path : null;

    if (Picture) {
      updatedImage = await updateImage(Picture, currentProfilePicture);
    }
    //////

    const result = await updateUserInfo(userId, {
      name,
      about,
      newImage: updatedImage ? updatedImage.data.url : newProfilePicture, // KEEP FIXING
    });

    if (!result.success) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `from Update: ${error.message}` });
  }
};

export const deleteUserInfo = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "FROM DELETE: Incomplete Parameters" });
    }

    const imageToDelete = await getUser({ id: userId });
    const deletedResult = await deleteImageFromImageHost(
      imageToDelete.user.ProfilePicture
    );
    console.log(deletedResult);

    const result = await deleteUserById(userId);

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: `from User: ${error.message}` });
  }
};
