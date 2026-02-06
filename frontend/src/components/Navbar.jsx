import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const letter = (user?.name || 'U').slice(0, 1).toUpperCase();

  return (
    <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      <h5 className="mb-0 fw-bold">Social</h5>

      <div className="d-flex align-items-center gap-3">
        <span className="badge bg-warning text-dark">⭐ 100</span>
        <span className="badge bg-success">₹0.00</span>
        <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
             style={{ width: 35, height: 35 }}>
          {letter}
        </div>

        {user ? (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
