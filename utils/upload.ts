import multer from "multer";

const storage = multer.memoryStorage();

export default () => multer({ storage });
