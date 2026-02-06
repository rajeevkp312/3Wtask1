import { useState } from 'react';
import axios from '../api/axiosInstance';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const serverBase = apiBase.replace(/\/api\/?$/, '');

const formatTime = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '';
  }
};

const PostCard = ({ post, onUpdated }) => {
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const like = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await axios.put(`/posts/${post._id}/like`);
      onUpdated?.(res.data);
    } finally {
      setBusy(false);
    }
  };

  const addComment = async () => {
    if (!comment.trim() || busy) return;
    setBusy(true);
    try {
      const res = await axios.post(`/posts/${post._id}/comment`, { text: comment.trim() });
      onUpdated?.(res.data);
      setComment('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between">
          <div>
            <h6 className="fw-bold mb-0">👑 {post.username}</h6>
            <small className="text-muted">
              {formatTime(post.createdAt)}
            </small>
          </div>

          <button className="btn btn-primary btn-sm rounded-pill">
            Follow
          </button>
        </div>

        {/* Content */}
        {post.text ? <p className="mt-3 mb-2">{post.text}</p> : null}

        {post.image && (
          <img
            src={post.image.startsWith('/uploads') ? `${serverBase}${post.image}` : post.image}
            alt=""
            className="img-fluid rounded"
          />
        )}

        {/* Footer */}
        <div className="d-flex justify-content-around text-muted mt-3">
          <button className="btn btn-link p-0 text-decoration-none" onClick={like} disabled={busy}>
            ❤️ {post.likes?.length || 0}
          </button>
          <span>💬 {post.comments?.length || 0}</span>
          <span>🔗</span>
        </div>

        <div className="mt-3">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={addComment} disabled={busy || !comment.trim()}>
              Post
            </button>
          </div>

          {post.comments?.length ? (
            <div className="mt-2">
              {post.comments.slice(-2).map((c, idx) => (
                <div key={idx} className="small">
                  <span className="fw-semibold">{c.username}:</span> {c.text}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
