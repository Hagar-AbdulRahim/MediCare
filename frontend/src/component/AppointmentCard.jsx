import React from "react";

function AppointmentCard({ appointment, patientName, doctorName, onDelete }) {
  const appointmentDate = new Date(appointment.date).toLocaleString();

  const statusColor = {
    Pending: "#FF9800",
    Confirmed: "#4CAF50",
    Completed: "#2196F3",
    Cancelled: "#f44336",
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#333" }}>
        Appointment #{appointment.id}
      </h3>
      <p>
        <strong>Patient:</strong> {patientName}
      </p>
      <p>
        <strong>Doctor:</strong> {doctorName}
      </p>
      <p>
        <strong>Date & Time:</strong> {appointmentDate}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "20px",
            backgroundColor: statusColor[appointment.status] || "#999",
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {appointment.status}
        </span>
      </p>
      <button
        onClick={onDelete}
        style={{
          padding: "8px 15px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default AppointmentCard;
