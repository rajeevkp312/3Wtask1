const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const protect = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  likePost,
  addComment
} = require('../controllers/postController');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `p_${Date.now()}${ext || '.jpg'}`);
  }
});

const upload = multer({ storage });

router.post('/', protect, upload.single('image'), createPost);
router.get('/', getAllPosts);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
