import React from "react";

function PatientCard({ patient, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#333" }}>{patient.name}</h3>
      <p>
        <strong>Age:</strong> {patient.age}
      </p>
      <p>
        <strong>Gender:</strong> {patient.gender}
      </p>
      <p>
        <strong>Phone:</strong> {patient.phone}
      </p>
      <p>
        <strong>Email:</strong> {patient.email}
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

export default PatientCard;
