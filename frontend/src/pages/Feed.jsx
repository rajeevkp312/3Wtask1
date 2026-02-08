import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CreatePost from '../components/CreatePost';
import PostFilter from '../components/PostFilter';
import PostCard from '../components/PostCard';
import axios from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/posts?sort=${sort}&page=1&limit=20`);
      setPosts(res.data);
    } catch (e) {
      if (e?.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate, sort]);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreate = async ({ text, file }) => {
    const fd = new FormData();
    if (text) fd.append('text', text);
    if (file) fd.append('image', file);

    const res = await axios.post('/posts', fd);
    setPosts((prev) => [res.data, ...prev]);
  };

  const patchPost = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const removePost = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <>
      <Navbar />
      <SearchBar />

      <div className="container" style={{ maxWidth: 600 }}>
        <CreatePost onPost={handleCreate} />
        <PostFilter value={sort} onChange={setSort} />

        {loading ? (
          <div className="text-center text-muted mt-4">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted mt-4">No posts yet</div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              myUserId={user?.id}
              onUpdated={patchPost}
              onDeleted={removePost}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Feed;
