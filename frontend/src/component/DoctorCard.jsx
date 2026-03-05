import React from "react";

function DoctorCard({ doctor, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#333" }}>{doctor.name}</h3>
      <p>
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p>
        <strong>Phone:</strong> {doctor.phone}
      </p>
      <p>
        <strong>Email:</strong> {doctor.email}
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

export default DoctorCard;
