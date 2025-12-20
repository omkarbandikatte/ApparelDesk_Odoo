// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Disk storage (local files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/'); // create this folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  },
});

module.exports = upload;
