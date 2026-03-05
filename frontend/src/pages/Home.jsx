import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">🏥 Hospital Management System</h1>
        </div>
        <div className="navbar-center">
          <button onClick={() => navigate("/doctors")} className="nav-button">
            Browse Doctors
          </button>
        </div>
        <div className="navbar-right">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                <span className="avatar-icon">👤</span>
              )}
            </div>
            <span className="user-info">Welcome {user?.name || "User"}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="home-content">
        <div className="welcome-section">
          <h2>Welcome to Hospital Management System</h2>
          <p>
            Browse doctors, book appointments, and manage your medical needs.
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="primary-button"
          >
            Browse Available Doctors
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
