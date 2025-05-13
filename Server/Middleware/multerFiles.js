import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})


export const upload = multer({ storage });