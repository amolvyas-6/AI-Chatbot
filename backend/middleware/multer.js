import multer from "multer";

// Use Disk Storage for Multer (store data temporarily in /public/temp)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

export { upload };
