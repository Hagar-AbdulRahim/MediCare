import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FaUserCircle,
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaHistory,
  FaUser,
  FaVenusMars
} from "react-icons/fa";
import "../styles/UserProfile.css";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  // Notifications kept for logic but not displayed
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("appointments");

  useEffect(() => {
    // التحقق من المصادقة والتأكد من أن المريض يشاهد بروفايله فقط
    if (!isAuthenticated || !user?.id) {
      navigate("/login");
      return;
    }

    // التأكد من أن المريض يشاهد بروفايله فقط
    if (String(user.id) !== String(id)) {
      navigate("/");
      return;
    }

    fetchUserData();
  }, [id, user, isAuthenticated, navigate]);

  const fetchUserData = async () => {
    try {
      const appointmentsRes = await axios.get(
        "http://localhost:3000/appointments"
      );

      // إذا كان المستخدم مريض، نعرض حجوزاته
      // إذا كان المستخدم طبيب، نعرض حجوزات المرضى لديه
      let userAppointments = [];
      if (user?.userType === "patient") {
        userAppointments = appointmentsRes.data.filter(
          (apt) => apt.patientId === user.id
        );
      } else if (user?.userType === "doctor") {
        userAppointments = appointmentsRes.data.filter(
          (apt) => apt.doctorId === user.id
        );
      }

      setAppointments(userAppointments);

      const doctorsRes = await axios.get("http://localhost:3000/doctors");
      setDoctors(doctorsRes.data);

      // جلب معلومات المرضى (للعرض في حالة كان المستخدم طبيب)
      if (user?.userType === "doctor") {
        const patientsRes = await axios.get("http://localhost:3000/patients");
        setPatients(patientsRes.data);
      }

      // جلب الإشعارات
      const notificationsRes = await axios.get("http://localhost:3000/notifications");
      const userNotifications = notificationsRes.data.filter(
        (notif) => notif.userId === user.id && notif.userType === user.userType
      );
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:3000/appointments/${appointmentId}`);
      setSuccessMessage("✓ Appointment cancelled successfully");
      setTimeout(() => {
        setSuccessMessage("");
        fetchUserData();
      }, 2000);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("An error occurred while cancelling");
    }
  };

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );
  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed"
  );

  if (loading)
    return (
      <div className="user-profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );

  return (
    <div className="user-profile-container">
      <button onClick={() => navigate("/")} className="back-btn">
        ← Back to Home
      </button>

      {successMessage && <div className="success-alert">{successMessage}</div>}

      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              <span className="avatar-emoji">
                {user?.userType === "doctor" ? <FaUserMd /> : <FaUserCircle />}
              </span>
            )}
          </div>
          <div className="profile-details">
            <h1>{user?.name || "User"}</h1>
            <p className="profile-email"><FaEnvelope style={{ marginRight: '5px' }} /> {user?.email || ""}</p>
            <p className="profile-phone"><FaPhone style={{ marginRight: '5px' }} /> {user?.phone || "Not provided"}</p>
            {user?.userType === "doctor" && user?.specialization && (
              <p className="profile-specialization">
                {user.specialization}
              </p>
            )}
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">
                  {pendingAppointments.length}
                </span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {confirmedAppointments.length}
                </span>
                <span className="stat-label">Confirmed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{appointments.length}</span>
                <span className="stat-label">Total Appointments</span>
              </div>
            </div>
          </div>
        </div>

        {user?.userType === "patient" && (
          <button
            onClick={() => navigate("/doctors")}
            className="book-appointment-btn"
          >
            + Book New Appointment
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-btn ${selectedTab === "appointments" ? "active" : ""
              }`}
            onClick={() => setSelectedTab("appointments")}
          >
            <FaCalendarAlt style={{ marginRight: '6px' }} /> All Appointments ({appointments.length})
          </button>
          <button
            className={`tab-btn ${selectedTab === "pending" ? "active" : ""}`}
            onClick={() => setSelectedTab("pending")}
          >
            <FaHourglassHalf style={{ marginRight: '6px' }} /> Pending ({pendingAppointments.length})
          </button>
          <button
            className={`tab-btn ${selectedTab === "confirmed" ? "active" : ""}`}
            onClick={() => setSelectedTab("confirmed")}
          >
            <FaCheckCircle style={{ marginRight: '6px' }} /> Confirmed ({confirmedAppointments.length})
          </button>
        </div>

        {/* All Appointments Tab */}
        {selectedTab === "appointments" && (
          <div className="tab-content">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><FaHistory /></span>
                <h3>No Appointments Yet</h3>
                <p>Start by booking an appointment with one of our doctors</p>
                <button
                  onClick={() => navigate("/doctors")}
                  className="btn-explore"
                >
                  Explore Doctors
                </button>
              </div>
            ) : (
              <div className="appointments-timeline">
                {appointments.map((apt) => {
                  const patientInfo = user?.userType === "doctor"
                    ? patients.find((p) => p.id === apt.patientId)
                    : null;
                  return (
                    <div
                      key={apt.id}
                      className={`appointment-timeline-card ${apt.status}`}
                    >
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="apt-header">
                          <h3>
                            {user?.userType === "doctor"
                              ? apt.patientName
                              : apt.doctorName}
                          </h3>
                          <span className={`status-badge ${apt.status}`}>
                            {apt.status === "pending" ? (
                              <>
                                <FaHourglassHalf style={{ marginRight: '5px' }} />
                                Waiting for Confirmation
                              </>
                            ) : (
                              <>
                                <FaCheckCircle style={{ marginRight: '5px' }} />
                                Confirmed
                              </>
                            )}
                          </span>
                        </div>
                        {patientInfo && (
                          <div className="patient-info-section">
                            <div className="patient-info-item">
                              <span className="icon"><FaPhone /></span>
                              <span>{patientInfo.phone || "N/A"}</span>
                            </div>
                            <div className="patient-info-item">
                              <span className="icon"><FaEnvelope /></span>
                              <span>{patientInfo.email || "N/A"}</span>
                            </div>
                            {patientInfo.age > 0 && (
                              <div className="patient-info-item">
                                <span className="icon"><FaUser /></span>
                                <span>{patientInfo.age} years old</span>
                              </div>
                            )}
                            {patientInfo.gender && (
                              <div className="patient-info-item">
                                <span className="icon"><FaVenusMars /></span>
                                <span>{patientInfo.gender}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="apt-details-grid">
                          <div className="apt-detail">
                            <span className="detail-icon"><FaCalendarAlt /></span>
                            <div>
                              <p className="detail-label">Date</p>
                              <p className="detail-value">
                                {new Date(apt.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="apt-detail">
                            <span className="detail-icon"><FaClock /></span>
                            <div>
                              <p className="detail-label">Time</p>
                              <p className="detail-value">
                                {new Date(apt.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        {apt.status === "pending" && user?.userType === "patient" && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="cancel-apt-btn"
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pending Appointments Tab */}
        {selectedTab === "pending" && (
          <div className="tab-content">
            {pendingAppointments.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><FaCheckCircle style={{ color: '#10b981' }} /></span>
                <h3>No Pending Appointments</h3>
                <p>
                  Great! You don't have any appointments waiting for
                  confirmation
                </p>
              </div>
            ) : (
              <div className="appointments-grid">
                {pendingAppointments.map((apt) => {
                  const patientInfo = user?.userType === "doctor"
                    ? patients.find((p) => p.id === apt.patientId)
                    : null;
                  return (
                    <div key={apt.id} className="appointment-card pending">
                      <div className="card-header">
                        <h3>
                          {user?.userType === "doctor"
                            ? apt.patientName
                            : apt.doctorName}
                        </h3>
                        <span className="badge-pending">Pending</span>
                      </div>
                      <div className="card-body">
                        {patientInfo && (
                          <div className="patient-info-section">
                            <div className="patient-info-item">
                              <span className="icon"><FaPhone /></span>
                              <span>{patientInfo.phone || "N/A"}</span>
                            </div>
                            <div className="patient-info-item">
                              <span className="icon"><FaEnvelope /></span>
                              <span>{patientInfo.email || "N/A"}</span>
                            </div>
                            {patientInfo.age > 0 && (
                              <div className="patient-info-item">
                                <span className="icon"><FaUser /></span>
                                <span>{patientInfo.age} years old</span>
                              </div>
                            )}
                            {patientInfo.gender && (
                              <div className="patient-info-item">
                                <span className="icon"><FaVenusMars /></span>
                                <span>{patientInfo.gender}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="icon"><FaCalendarAlt /></span>
                          <span>{new Date(apt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="icon"><FaClock /></span>
                          <span>
                            {new Date(apt.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="detail-row status-row">
                          <span className="icon"><FaHourglassHalf /></span>
                          <span>
                            {user?.userType === "doctor"
                              ? "Waiting for your confirmation"
                              : "Waiting for doctor confirmation"}
                          </span>
                        </div>
                      </div>
                      {user?.userType === "patient" && (
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="cancel-btn-small"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Confirmed Appointments Tab */}
        {selectedTab === "confirmed" && (
          <div className="tab-content">
            {confirmedAppointments.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><FaHistory /></span>
                <h3>No Confirmed Appointments</h3>
                <p>Book an appointment to get it confirmed by your doctor</p>
              </div>
            ) : (
              <div className="appointments-grid">
                {confirmedAppointments.map((apt) => {
                  const patientInfo = user?.userType === "doctor"
                    ? patients.find((p) => p.id === apt.patientId)
                    : null;
                  return (
                    <div key={apt.id} className="appointment-card confirmed">
                      <div className="card-header">
                        <h3>
                          {user?.userType === "doctor"
                            ? apt.patientName
                            : apt.doctorName}
                        </h3>
                        <span className="badge-confirmed">Confirmed <FaCheckCircle style={{ marginLeft: '4px' }} /></span>
                      </div>
                      <div className="card-body">
                        {patientInfo && (
                          <div className="patient-info-section">
                            <div className="patient-info-item">
                              <span className="icon"><FaPhone /></span>
                              <span>{patientInfo.phone || "N/A"}</span>
                            </div>
                            <div className="patient-info-item">
                              <span className="icon"><FaEnvelope /></span>
                              <span>{patientInfo.email || "N/A"}</span>
                            </div>
                            {patientInfo.age > 0 && (
                              <div className="patient-info-item">
                                <span className="icon"><FaUser /></span>
                                <span>{patientInfo.age} years old</span>
                              </div>
                            )}
                            {patientInfo.gender && (
                              <div className="patient-info-item">
                                <span className="icon"><FaVenusMars /></span>
                                <span>{patientInfo.gender}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="icon"><FaCalendarAlt /></span>
                          <span>{new Date(apt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="icon"><FaClock /></span>
                          <span>
                            {new Date(apt.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="detail-row status-row confirmed-status">
                          <span className="icon"><FaCheckCircle /></span>
                          <span>Ready for appointment</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
