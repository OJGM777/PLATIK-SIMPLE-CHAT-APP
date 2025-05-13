import express from "express";
import { logIn, register } from "../Controllers/authControllers.js";
import { upload } from "../Middleware/multerFiles.js";


const router = express.Router();

router.post("/register",  upload.single("profilePicture"), register);
router.post("/log", upload.none(), logIn); 


export default router;