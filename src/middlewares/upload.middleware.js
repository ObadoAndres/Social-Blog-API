import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadImageMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      let statusCode = 400;
      let message = err.message;

      if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = 413;
        message = "Image size must be less than 5MB";
      }

      return res.status(statusCode).json({ success: false, message });
    }

    next();
  });
};

export { upload };