const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    username: {
      type: String,
      required: true
    },

    text: {
      type: String,
      default: ''
    },

    image: {
      type: String,
      default: ''
    },

    likes: {
      type: [String], // usernames who liked
      default: []
    },

    comments: [
      {
        username: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
