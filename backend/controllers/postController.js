const Post = require('../models/Post');

/* ========== CREATE POST ========== */
const createPost = async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    // at least one required
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: 'Text or image is required' });
    }

    const post = await Post.create({
      userId: req.user._id,
      username: req.user.name,
      text,
      image
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== UPDATE POST ========== */
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const nextText = typeof req.body.text === 'string' ? req.body.text.trim() : undefined;
    const nextImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    if ((nextText === undefined || nextText === post.text) && nextImage === undefined) {
      return res.json(post);
    }

    if (nextText !== undefined) post.text = nextText;
    if (nextImage !== undefined) post.image = nextImage;

    if (!post.text && !post.image) {
      return res.status(400).json({ message: 'Text or image is required' });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== DELETE POST ========== */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await post.deleteOne();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== GET FEED ========== */
const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);
    const sort = (req.query.sort || 'recent').toLowerCase();

    let sortQuery = { createdAt: -1 };
    if (sort === 'liked') sortQuery = { likesCount: -1, createdAt: -1 };
    if (sort === 'commented') sortQuery = { commentsCount: -1, createdAt: -1 };

    const posts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } }
        }
      },
      { $sort: sortQuery },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { likesCount: 0, commentsCount: 0 } }
    ]);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== LIKE POST ========== */
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const idx = post.likes.indexOf(req.user.name);
    if (idx >= 0) post.likes.splice(idx, 1);
    else post.likes.push(req.user.name);

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== COMMENT POST ========== */
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      username: req.user.name,
      text
    });

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment,
  updatePost,
  deletePost
};
