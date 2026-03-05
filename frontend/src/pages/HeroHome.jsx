import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaHospital,
  FaUserMd,
  FaCalendarCheck,
  FaCheckCircle,
  FaShieldAlt,
  FaUserCircle,
  FaHeartbeat
} from "react-icons/fa";
import "../styles/HeroHome.css";

function HeroHome() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.userType === "doctor") {
      fetchPendingAppointments();
      const interval = setInterval(() => {
        fetchPendingAppointments();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchPendingAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/appointments");
      const count = response.data.filter(
        (apt) => apt.doctorId === user.id && apt.status === "pending"
      ).length;
      setPendingCount(count);
    } catch (error) {
      console.error("Error fetching pending appointments:", error);
    }
  };

  return (
    <div className="hero-container">
      {/* Navigation */}
      <nav className="hero-nav">
        <h2 className="logo">
          <FaHospital style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          MediCare
        </h2>
        <div className="nav-links">
          <button onClick={() => navigate("/doctors")} className="nav-link">
            Find Doctors
          </button>
          <button onClick={() => navigate("/patients")} className="nav-link">
            Patients
          </button>
          {isAuthenticated ? (
            <>
              {user?.userType === "doctor" ? (
                <>
                  <button
                    onClick={() => navigate(`/doctor-profile/${user?.id}`)}
                    className="nav-link dashboard-btn"
                  >
                    <FaUserMd style={{ marginRight: '5px' }} />
                    My Dashboard
                    {pendingCount > 0 && (
                      <span className="notif-badge">{pendingCount}</span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/doctors")}
                    className="nav-link"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => {
                      if (user?.id) {
                        navigate(`/user-profile/${user.id}`);
                      }
                    }}
                    className="nav-link"
                  >
                    <FaUserCircle style={{ marginRight: '5px' }} />
                    My Profile
                  </button>
                </>
              )}
              <div className="user-section">
                <span className="user-name">{user?.name || "User"}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="nav-link btn-logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="nav-link">
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="nav-link btn-primary"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MediCare</h1>
          <h2>Hospital Management System</h2>
          <p>Book your appointment with the best doctors easily and quickly</p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/doctors")}
              className="btn-large btn-primary"
            >
              Find & Book Doctor
            </button>
            <button
              onClick={() => navigate("/patients")}
              className="btn-large btn-secondary"
            >
              View Patients
            </button>
          </div>
        </div>
        <div className="hero-image">
          {/* Using a large icon as placeholder for hero image */}
          <FaHeartbeat className="hero-icon-large" style={{ fontSize: '200px', color: 'rgba(255,255,255,0.2)' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose MediCare?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon"><FaUserMd /></span>
            <h3>Expert Doctors</h3>
            <p>
              Professional medical team of the best specialists with years of
              experience
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaCalendarCheck /></span>
            <h3>Easy Booking</h3>
            <p>
              Book your appointment in just a few minutes with flexible
              scheduling
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaCheckCircle /></span>
            <h3>Instant Confirmation</h3>
            <p>
              Get your appointment confirmation immediately with status updates
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaShieldAlt /></span>
            <h3>Secure & Private</h3>
            <p>Your medical information is secure with us always</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="hero-footer">
        <p>&copy; 2025 Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HeroHome;
