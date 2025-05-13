import express from "express";
import { TokenVerification } from "../Middleware/AuthJWT.js";
import { createAndSendImage, createAndSendMessages, deleteMessage, getMessagesFromChat, updateMessage } from "../Controllers/MessageController.js";
import { upload } from "../Middleware/multerFiles.js";

const router = express.Router();

router.post("/send", upload.none(), TokenVerification, createAndSendMessages);
router.post("/send/image", TokenVerification, upload.single("NewMessageImage"), createAndSendImage);
router.get("/get/:chatId", TokenVerification, getMessagesFromChat);
router.delete("/delete/:messageId", TokenVerification,  deleteMessage);
router.patch("/update", TokenVerification, upload.none(),  updateMessage)

export default router;