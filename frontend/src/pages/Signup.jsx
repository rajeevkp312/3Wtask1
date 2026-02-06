import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('/auth/register', {
        name,
        email,
        password
      });

      navigate('/');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h4 className="text-center mb-3">Signup</h4>

        <input
          className="form-control mb-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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

        <button className="btn btn-primary w-100" onClick={handleSignup}>
          Signup
        </button>

        <div className="text-center mt-3 small">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
