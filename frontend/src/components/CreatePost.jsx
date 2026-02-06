import { useRef, useState } from 'react';

const CreatePost = ({ onPost }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const canPost = Boolean(text.trim() || file);

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body">
        <h6 className="fw-bold mb-2">Create Post</h6>

        <textarea
          className="form-control border-0"
          rows="2"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => fileRef.current?.click()}
            >
              Post photos
            </button>

            {file ? (
              <span className="text-success small fw-semibold">✓</span>
            ) : null}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            disabled={!canPost}
            onClick={() => {
              onPost({ text: text.trim(), file });
              setText('');
              setFile(null);
              if (fileRef.current) fileRef.current.value = '';
            }}
          >
            ➤ Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
