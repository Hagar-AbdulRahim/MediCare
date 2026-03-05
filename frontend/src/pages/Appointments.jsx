import React, { useEffect, useState } from "react";
import { appointmentsAPI, patientsAPI, doctorsAPI } from "../api/apiClient";
import AppointmentCard from "../component/AppointmentCard";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        patientsAPI.getAll(),
        doctorsAPI.getAll(),
      ]);
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentsAPI.create({
        ...newAppointment,
        patientId: parseInt(newAppointment.patientId),
        doctorId: parseInt(newAppointment.doctorId),
      });
      setNewAppointment({
        patientId: "",
        doctorId: "",
        date: "",
        status: "Pending",
      });
      fetchData();
    } catch (err) {
      setError("Failed to add appointment");
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await appointmentsAPI.delete(id);
      fetchData();
    } catch (err) {
      setError("Failed to delete appointment");
      console.error(err);
    }
  };

  const getPatientName = (id) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? patient.name : "Unknown Patient";
  };

  const getDoctorName = (id) => {
    const doctor = doctors.find((d) => d.id === id);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Appointments</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleAddAppointment}
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>Schedule New Appointment</h3>
        <select
          value={newAppointment.patientId}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, patientId: e.target.value })
          }
          required
          style={{ marginRight: "10px", padding: "8px" }}
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        <select
          value={newAppointment.doctorId}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, doctorId: e.target.value })
          }
          required
          style={{ marginRight: "10px", padding: "8px" }}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={newAppointment.date}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, date: e.target.value })
          }
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <select
          value={newAppointment.status}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, status: e.target.value })
          }
          style={{ marginRight: "10px", padding: "8px" }}
        >
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Schedule Appointment
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "15px",
        }}
      >
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            patientName={getPatientName(appointment.patientId)}
            doctorName={getDoctorName(appointment.doctorId)}
            onDelete={() => handleDeleteAppointment(appointment.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Appointments;
