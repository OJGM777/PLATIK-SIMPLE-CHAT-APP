import { accessOneToOneChat, addToGroup, createGroupChats, deleteAllMessagesFromChat, deleteEntireChat, editChatInfo, removeFromGroup } from "../Controllers/ChatControllers.js";
import { TokenVerification } from "../Middleware/AuthJWT.js";
import express from "express"
import { getUserChats } from "../Controllers/ChatControllers.js";
import { upload } from "../Middleware/multerFiles.js";
import { getChatInfo } from "../Controllers/ChatControllers.js";



const router = express.Router();

router.get("/get/:id", TokenVerification, getUserChats)
router.get("/:id", TokenVerification, getChatInfo);
router.post("/group", TokenVerification, upload.single("chatImage"), createGroupChats);
router.post("/", TokenVerification, upload.none(), accessOneToOneChat);
router.patch("/edit", TokenVerification, upload.single("newChatImage"), editChatInfo);
router.patch("/remove", TokenVerification,  upload.none(), removeFromGroup);
router.patch("/add", TokenVerification, upload.none(), addToGroup );
router.delete("/deleteAllMessages", TokenVerification,upload.none(), deleteAllMessagesFromChat )
router.delete("/delete", TokenVerification, upload.none(), deleteEntireChat)



export default router;