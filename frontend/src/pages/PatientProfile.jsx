import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/PatientProfile.css";

function PatientProfile() {
  const { patientId } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من المصادقة والتأكد من أن المستخدم هو المريض نفسه
    if (!isAuthenticated || !user?.id) {
      navigate("/login");
      return;
    }

    // التأكد من أن المريض يشاهد بروفايله فقط
    if (String(user.id) !== String(patientId)) {
      navigate("/");
      return;
    }

    fetchPatientData();
  }, [patientId, user, isAuthenticated, navigate]);

  const fetchPatientData = async () => {
    try {
      const patientRes = await axios.get(
        `http://localhost:3000/patients/${patientId}`
      );
      setPatient(patientRes.data);

      const appointmentsRes = await axios.get(
        "http://localhost:3000/appointments"
      );
      const patientAppointments = appointmentsRes.data.filter(
        (apt) => apt.patientId === patientId
      );
      setAppointments(patientAppointments);

      const doctorsRes = await axios.get("http://localhost:3000/doctors");
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const doctor = doctors.find((d) => d.id === selectedDoctor);
      const newAppointment = {
        patientId: patientId,
        patientName: patient.name,
        doctorId: selectedDoctor,
        doctorName: doctor.name,
        date: `${appointmentDate}T${appointmentTime}`,
        status: "pending",
      };

      await axios.post("http://localhost:3000/appointments", newAppointment);
      setSuccessMessage(
        "✓ Appointment booked successfully! Waiting for doctor confirmation."
      );
      setTimeout(() => {
        setSuccessMessage("");
        setShowBooking(false);
        setSelectedDoctor("");
        setAppointmentDate("");
        setAppointmentTime("");
        fetchPatientData();
      }, 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:3000/appointments/${appointmentId}`);
      setSuccessMessage("✓ Appointment cancelled successfully");
      setTimeout(() => {
        setSuccessMessage("");
        fetchPatientData();
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

  if (loading) return <div className="loading">Loading patient profile...</div>;
  if (!patient) return <div className="loading">Patient not found</div>;

  return (
    <div className="patient-profile-container">
      <button onClick={() => navigate("/patients")} className="back-btn">
        ← Back to Patients
      </button>

      {successMessage && <div className="success-alert">{successMessage}</div>}

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            {patient.profileImage ? (
              <img src={patient.profileImage} alt={patient.name} />
            ) : (
              <span className="profile-icon">👤</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{patient.name}</h1>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <span>{patient.age} years old</span>
              </div>
              <div className="info-item">
                <span className="info-icon">👥</span>
                <span>{patient.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <span>{patient.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">✉️</span>
                <span>{patient.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="appointments-container">
        <div className="booking-section">
          <div className="section-header">
            <h2>Book New Appointment</h2>
          </div>

          {!showBooking ? (
            <button onClick={() => setShowBooking(true)} className="book-btn">
              + Schedule Appointment
            </button>
          ) : (
            <form onSubmit={handleBookAppointment} className="booking-form">
              <div className="form-group">
                <label htmlFor="doctor">Select Doctor:</label>
                <select
                  id="doctor"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Appointment Date:</label>
                <input
                  type="date"
                  id="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Appointment Time:</label>
                <input
                  type="time"
                  id="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Confirm Booking
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowBooking(false);
                    setSelectedDoctor("");
                    setAppointmentDate("");
                    setAppointmentTime("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="appointments-list-section">
          <div className="section-header">
            <h2>Pending Appointments</h2>
            <span className="badge">{pendingAppointments.length}</span>
          </div>
          {pendingAppointments.length === 0 ? (
            <p className="no-appointments">No pending appointments</p>
          ) : (
            <div className="appointments-grid">
              {pendingAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card pending-card">
                  <div className="apt-header">
                    <h3>{apt.doctorName}</h3>
                    <span className="status-badge pending">Pending</span>
                  </div>
                  <div className="apt-body">
                    <div className="apt-detail">
                      <span className="icon">📅</span>
                      <span>{new Date(apt.date).toLocaleDateString()}</span>
                    </div>
                    <div className="apt-detail">
                      <span className="icon">⏰</span>
                      <span>
                        {new Date(apt.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="cancel-apt-btn"
                  >
                    Cancel Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="appointments-list-section confirmed-section">
          <div className="section-header">
            <h2>Confirmed Appointments</h2>
            <span className="badge confirmed-badge">
              {confirmedAppointments.length}
            </span>
          </div>
          {confirmedAppointments.length === 0 ? (
            <p className="no-appointments">No confirmed appointments</p>
          ) : (
            <div className="appointments-grid">
              {confirmedAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card confirmed-card">
                  <div className="apt-header">
                    <h3>{apt.doctorName}</h3>
                    <span className="status-badge confirmed">Confirmed</span>
                  </div>
                  <div className="apt-body">
                    <div className="apt-detail">
                      <span className="icon">📅</span>
                      <span>{new Date(apt.date).toLocaleDateString()}</span>
                    </div>
                    <div className="apt-detail">
                      <span className="icon">⏰</span>
                      <span>
                        {new Date(apt.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
