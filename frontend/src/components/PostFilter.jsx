const PostFilter = ({ value, onChange }) => {
  return (
    <div className="d-flex gap-2 mt-3 mb-2">
      <button
        className={`btn btn-sm rounded-pill ${value === 'recent' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onChange('recent')}
      >
        All Post
      </button>
      <button
        className={`btn btn-sm rounded-pill ${value === 'liked' ? 'btn-success' : 'btn-outline-success'}`}
        onClick={() => onChange('liked')}
      >
        Most Liked
      </button>
      <button
        className={`btn btn-sm rounded-pill ${value === 'commented' ? 'btn-info text-white' : 'btn-outline-info'}`}
        onClick={() => onChange('commented')}
      >
        Most Commented
      </button>
    </div>
  );
};

export default PostFilter;
