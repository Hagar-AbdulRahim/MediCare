import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaEnvelope, FaPhone, FaUser, FaFemale, FaMale, FaBirthdayCake } from "react-icons/fa";
import "../styles/PatientsPage.css";

function Patients() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    if (user?.userType !== "doctor") {
      setLoading(false);
      return;
    }

    fetchPatients();
  }, [isAuthenticated, user, authLoading]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="patients-page-container">
        <div className="loading">Loading patients list...</div>
      </div>
    );
  }

  // Access Control Views
  if (!isAuthenticated) {
    return (
      <div className="patients-page-container">
        <div className="patients-header">
          <h1>Access Denied</h1>
          <p>Please login to view this page.</p>
          <button onClick={() => navigate("/login")} className="back-btn" style={{ position: 'static', marginTop: '20px' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user?.userType !== "doctor") {
    return (
      <div className="patients-page-container">
        <div className="patients-header">
          <h1>Doctors Only</h1>
          <p>This page is restricted to medical staff only.</p>
          <button onClick={() => navigate("/")} className="back-btn" style={{ position: 'static', marginTop: '20px' }}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-page-container">
      <div className="patients-header">

        <div className="header-content">
          <h1>Patients List</h1>
          <p>Manage and view all registered patients</p>
        </div>
      </div>

      <div className="patients-grid">
        {patients.map((patient) => (
          <div key={patient.id} className="patient-card">
            <div className="patient-avatar-container">
              <div className="patient-avatar-placeholder">
                {patient.gender === "female" ? (
                  <FaFemale style={{ color: '#ec4899', fontSize: '32px' }} />
                ) : (
                  <FaMale style={{ color: '#3b82f6', fontSize: '32px' }} />
                )}
              </div>
            </div>
            <div className="card-content">
              <h3>{patient.name}</h3>
              <div className="info-list">
                <p>
                  <span className="icon"><FaEnvelope /></span>
                  <span>{patient.email}</span>
                </p>
                <p>
                  <span className="icon"><FaPhone /></span>
                  <span>{patient.phone || "N/A"}</span>
                </p>
                <div className="meta-row">
                  <span className="meta-badge">
                    {patient.gender || <FaUser />}
                  </span>
                  <span className="meta-badge">
                    {patient.age ? <><FaBirthdayCake style={{ marginRight: '5px' }} /> {patient.age} years</> : "Age N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Patients;
