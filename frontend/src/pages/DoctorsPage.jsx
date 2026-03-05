import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import {
  FaSearch,
  FaUserMd,
  FaStar,
  FaCalendarAlt,
  FaUsers,
  FaTimes,
  FaCheckCircle
} from "react-icons/fa";
import "../styles/DoctorsPage.css";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const results = doctors.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:3000/doctors");
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.userType === "doctor") {
      alert("Doctors cannot book appointments with other doctors.");
      return;
    }

    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!appointmentDate || !appointmentTime) {
      alert("Please select both date and time");
      return;
    }

    if (!user?.id) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    try {
      const appointmentData = {
        patientId: user.id,
        patientName: user.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: `${appointmentDate}T${appointmentTime}`,
        status: "pending",
      };

      // Create appointment
      const appointmentRes = await axios.post("http://localhost:3000/appointments", appointmentData);
      const newAppointment = appointmentRes.data;

      // Create notification for doctor
      const doctorNotification = {
        userId: selectedDoctor.id,
        userType: "doctor",
        type: "appointment_request",
        title: "New Appointment Request",
        message: `${user.name} has requested an appointment on ${appointmentDate} at ${appointmentTime}`,
        appointmentId: newAppointment.id,
        read: false,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:3000/notifications", doctorNotification);

      setBookingMessage(
        `✅ Appointment booked successfully with Dr. ${selectedDoctor.name}!\nDate: ${appointmentDate}\nTime: ${appointmentTime}\n\nPlease wait for confirmation from the doctor.`
      );

      setTimeout(() => {
        setShowModal(false);
        setSelectedDoctor(null);
        setAppointmentDate("");
        setAppointmentTime("");
        setBookingMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment: " + (error.message || "Please try again"));
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setAppointmentDate("");
    setAppointmentTime("");
    setBookingMessage("");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="shimmer-effect loading-card"></div>
        <div className="shimmer-effect loading-card"></div>
        <div className="shimmer-effect loading-card"></div>
      </div>
    );
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="doctors-page-container">
      <div className="doctors-header">


        <div className="header-content">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Find Your Specialist
          </motion.h1>
          <motion.div
            className="search-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FaSearch className="search-icon" style={{ position: 'absolute', left: '20px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '50px' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="doctors-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="doctor-card"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="doctor-image-container">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-image"
                  />
                ) : (
                  <span className="image-placeholder">
                    <FaUserMd style={{ fontSize: '64px', color: '#cbd5e1' }} />
                  </span>
                )}
                <span className="specialization-badge">
                  {doctor.specialization}
                </span>
              </div>
              <div className="doctor-details">
                <h3 className="doctor-name">{doctor.name}</h3>
                <div className="rating-badge">
                  <FaStar style={{ color: '#fbbf24', marginRight: '4px' }} />
                  {doctor.rating || 'New'}
                </div>
                <p className="bio">{doctor.bio?.substring(0, 80)}...</p>
                <div className="doctor-meta">
                  {doctor.experience && (
                    <span className="meta-item">
                      <FaCalendarAlt style={{ marginRight: '6px' }} />
                      {doctor.experience}
                    </span>
                  )}
                  {doctor.patients !== undefined && (
                    <span className="meta-item">
                      <FaUsers style={{ marginRight: '6px' }} />
                      {doctor.patients} Patients
                    </span>
                  )}
                </div>
              </div>
              <div className="doctor-actions">
                {user?.userType === "doctor" ? (
                  <button
                    className="book-btn disabled"
                    disabled
                  >
                    Doctor Account
                  </button>
                ) : (
                  <button
                    className="book-btn"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results">
            <p>No doctors found matching "{searchTerm}"</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && selectedDoctor && (
          <motion.div
            className="modal-overlay"
            onClick={handleCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {bookingMessage ? (
                <div className="success-message" style={{ textAlign: 'center', padding: '20px' }}>
                  <FaCheckCircle style={{ fontSize: '50px', color: '#10b981', marginBottom: '20px' }} />
                  <h3 style={{ margin: '10px 0', color: '#1e293b' }}>Success!</h3>
                  <p style={{ color: '#64748b' }}>{bookingMessage}</p>
                </div>
              ) : (
                <>
                  <button className="close-btn" onClick={handleCancel}>
                    <FaTimes />
                  </button>
                  <h2>Book Appointment</h2>
                  <div className="modal-doctor-info">
                    {selectedDoctor.image ? (
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="modal-doctor-image"
                      />
                    ) : (
                      <div className="modal-doctor-image-placeholder" style={{
                        width: '70px', height: '70px', borderRadius: '12px', background: '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <FaUserMd style={{ fontSize: '32px', color: '#94a3b8' }} />
                      </div>
                    )}

                    <div>
                      <h3>{selectedDoctor.name}</h3>
                      <p className="modal-spec">{selectedDoctor.specialization}</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Select Date</label>
                    <input
                      type="date"
                      id="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Select Time</label>
                    <input
                      type="time"
                      id="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      className="confirm-btn"
                      onClick={handleConfirmBooking}
                    >
                      Confirm Booking
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DoctorsPage;
