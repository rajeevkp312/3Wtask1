import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        return alert('Email and password required');
      }

      const res = await axios.post('/auth/login', {
        email,
        password
      });

      login(res.data.user, res.data.token);
      navigate('/feed');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
  <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ width: '350px' }}>
      <h4 className="text-center mb-3">Login</h4>

      {user ? (
        <div className="alert alert-info py-2 small">
          Logged in as <b>{user.name}</b>
          <div className="mt-2 d-flex gap-2">
            <button className="btn btn-sm btn-primary" onClick={() => navigate('/feed')}>
              Go to feed
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                logout();
                setEmail('');
                setPassword('');
              }}
            >
              Use another account
            </button>
          </div>
        </div>
      ) : null}

      <input
        className="form-control mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={handleLogin} disabled={!!user}>
        Login
      </button>

      <div className="text-center mt-3 small">
        New here? <Link to="/signup">Create account</Link>
      </div>
    </div>
  </div>
);

};

export default Login;
