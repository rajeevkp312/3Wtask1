import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/feed');
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
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

      <button className="btn btn-primary w-100" onClick={handleLogin}>
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
