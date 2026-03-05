import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserMd,
  FaStar,
  FaCalendarAlt,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaCalendarCheck,
  FaClock,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
  FaUser,
  FaVenusMars
} from "react-icons/fa";
import "../styles/DoctorProfile.css";

function DoctorProfile() {
  const { doctorId } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من المصادقة والتأكد من أن المستخدم هو الطبيب نفسه
    if (!isAuthenticated || !user?.id) {
      navigate("/login");
      return;
    }

    // التأكد من أن الطبيب يشاهد بروفايله فقط
    if (String(user.id) !== String(doctorId)) {
      navigate("/");
      return;
    }

    fetchDoctorData();
  }, [doctorId, user, isAuthenticated, navigate]);

  const fetchDoctorData = async () => {
    try {
      const [doctorRes, appointmentsRes, patientsRes, notificationsRes] = await Promise.all([
        axios.get(`http://localhost:3000/doctors/${doctorId}`),
        axios.get("http://localhost:3000/appointments"),
        axios.get("http://localhost:3000/patients"),
        axios.get("http://localhost:3000/notifications"),
      ]);

      setDoctor(doctorRes.data);

      const doctorAppointments = appointmentsRes.data.filter(
        (apt) => apt.doctorId === doctorId
      );
      setAppointments(doctorAppointments);

      setPatients(patientsRes.data);

      const doctorNotifications = notificationsRes.data.filter(
        (notif) => notif.userId === doctorId && notif.userType === "doctor"
      );
      setNotifications(doctorNotifications);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      const appointmentRes = await axios.get(`http://localhost:3000/appointments/${appointmentId}`);
      const appointment = appointmentRes.data;

      await axios.patch(`http://localhost:3000/appointments/${appointmentId}`, {
        status: "confirmed",
      });

      const patientNotification = {
        userId: appointment.patientId,
        userType: "patient",
        type: "appointment_accepted",
        title: "Appointment Confirmed",
        message: `Dr. ${doctor?.name} has confirmed your appointment on ${new Date(appointment.date).toLocaleDateString()} at ${new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        appointmentId: appointmentId,
        read: false,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:3000/notifications", patientNotification);

      setSuccessMessage("✓ Appointment accepted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchDoctorData();
    } catch (error) {
      console.error("Error accepting appointment:", error);
      alert("Error accepting appointment. Please try again.");
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      const appointmentRes = await axios.get(`http://localhost:3000/appointments/${appointmentId}`);
      const appointment = appointmentRes.data;

      const patientNotification = {
        userId: appointment.patientId,
        userType: "patient",
        type: "appointment_rejected",
        title: "Appointment Rejected",
        message: `Dr. ${doctor?.name} has rejected your appointment request. Please book another time.`,
        appointmentId: appointmentId,
        read: false,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:3000/notifications", patientNotification);

      await axios.delete(`http://localhost:3000/appointments/${appointmentId}`);

      setSuccessMessage("✓ Appointment rejected successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchDoctorData();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      alert("Error rejecting appointment. Please try again.");
    }
  };

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );
  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed"
  );

  if (loading) return <div className="loading">Loading doctor profile...</div>;
  if (!doctor) return <div className="loading">Doctor not found</div>;

  return (
    <div className="doctor-profile-container">
      <button onClick={() => navigate("/doctors")} className="back-btn">
        ← Back to Doctors
      </button>

      {successMessage && <div className="success-alert">{successMessage}</div>}

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} />
            ) : (
              <span className="profile-icon">
                <FaUserMd style={{ fontSize: '60px', color: '#64748b' }} />
              </span>
            )}
          </div>
          <div className="profile-info">
            <h1>{doctor.name}</h1>
            <p className="specialization">{doctor.specialization}</p>
            <div className="rating-container">
              <span className="rating">
                <FaStar style={{ color: '#fbbf24', marginRight: '5px' }} />
                {doctor.rating || 4.5}
              </span>
            </div>
            <p className="bio">{doctor.bio}</p>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon"><FaCalendarAlt /></span>
                <span>{doctor.experience || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-icon"><FaUsers /></span>
                <span>{doctor.patients || 0} Patients</span>
              </div>
              <div className="info-item">
                <span className="info-icon"><FaPhone /></span>
                <span>{doctor.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon"><FaEnvelope /></span>
                <span>{doctor.email}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="appointments-container">
        <div className="appointments-section">
          <div className="section-header">
            <h2>Pending Appointment Requests</h2>
            <span className="badge">{pendingAppointments.length}</span>
          </div>
          {pendingAppointments.length === 0 ? (
            <div className="no-appointments">
              <FaCheckCircle style={{ fontSize: '40px', color: '#e2e8f0', marginBottom: '10px' }} />
              <p>No pending appointment requests</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {pendingAppointments.map((apt) => {
                const patientInfo = patients.find((p) => p.id === apt.patientId);
                return (
                  <div key={apt.id} className="appointment-card pending-card">
                    <div className="appointment-header">
                      <h3>{apt.patientName}</h3>
                      <span className="status-badge pending">
                        <FaHourglassHalf style={{ marginRight: '5px' }} /> Pending
                      </span>
                    </div>
                    <div className="appointment-body">
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
                      <div className="appointment-date">
                        <span className="icon"><FaCalendarCheck /></span>
                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="appointment-time">
                        <span className="icon"><FaClock /></span>
                        <span>
                          {new Date(apt.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button
                        onClick={() => handleAcceptAppointment(apt.id)}
                        className="accept-btn"
                      >
                        <FaCheck style={{ marginRight: '5px' }} /> Accept
                      </button>
                      <button
                        onClick={() => handleRejectAppointment(apt.id)}
                        className="reject-btn"
                      >
                        <FaTimes style={{ marginRight: '5px' }} /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="appointments-section confirmed-section">
          <div className="section-header">
            <h2>Confirmed Appointments</h2>
            <span className="badge confirmed-badge">
              {confirmedAppointments.length}
            </span>
          </div>
          {confirmedAppointments.length === 0 ? (
            <div className="no-appointments">
              <FaCalendarCheck style={{ fontSize: '40px', color: '#e2e8f0', marginBottom: '10px' }} />
              <p>No confirmed appointments</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {confirmedAppointments.map((apt) => {
                const patientInfo = patients.find((p) => p.id === apt.patientId);
                return (
                  <div key={apt.id} className="appointment-card confirmed-card">
                    <div className="appointment-header">
                      <h3>{apt.patientName}</h3>
                      <span className="status-badge confirmed">
                        <FaCheckCircle style={{ marginRight: '5px' }} /> Confirmed
                      </span>
                    </div>
                    <div className="appointment-body">
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
                      <div className="appointment-date">
                        <span className="icon"><FaCalendarCheck /></span>
                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="appointment-time">
                        <span className="icon"><FaClock /></span>
                        <span>
                          {new Date(apt.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
