const multer = require("multer");

const fileFilter = (req, file, cb) => {
  // Allow only JPG, PNG, and JPEG files
  if (!file.mimetype.match(/\/(jpg|jpeg|png)/)) {
    cb(new Error("Only JPG, PNG, and JPEG files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Set file size limit to 1MB
const limits = {
  fileSize: 1024 * 1024
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;
