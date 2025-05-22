import express from "express";
import { TokenVerification } from "../Middleware/AuthJWT.js";
import { deleteAllTheRelatedNotifications, getNotifications, sendNotifications } from "../Controllers/notificationsController.js";
import { upload } from "../Middleware/multerFiles.js";


const router = express.Router();

router.get("/get/:userId", TokenVerification, getNotifications);
router.delete("/delete/:userId/:chatId", TokenVerification, deleteAllTheRelatedNotifications)

export default router;