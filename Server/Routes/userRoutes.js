import { getUserById, searchUsers } from "../Controllers/searchController.js";
import { deleteUserInfo, editUserInfo } from "../Controllers/userInfoControllers.js";
import { TokenVerification } from "../Middleware/AuthJWT.js";
import express from "express"
import { upload } from "../Middleware/multerFiles.js";



const router = express.Router();

router.post("/search", TokenVerification, searchUsers);
router.get("/get", TokenVerification, getUserById);
router.patch("/edit", upload.single("newProfilePicture") , TokenVerification, editUserInfo);
router.delete("/delete", upload.single(), TokenVerification, deleteUserInfo);

export default router;