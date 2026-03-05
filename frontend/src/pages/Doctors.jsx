import React, { useEffect, useState } from "react";
import { doctorsAPI } from "../api/apiClient";
import DoctorCard from "../component/DoctorCard";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await doctorsAPI.create(newDoctor);
      setNewDoctor({
        name: "",
        specialization: "",
        phone: "",
        email: "",
      });
      fetchDoctors();
    } catch (err) {
      setError("Failed to add doctor");
      console.error(err);
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await doctorsAPI.delete(id);
      fetchDoctors();
    } catch (err) {
      setError("Failed to delete doctor");
      console.error(err);
    }
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctors</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleAddDoctor}
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>Add New Doctor</h3>
        <input
          type="text"
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, specialization: e.target.value })
          }
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={newDoctor.phone}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone: e.target.value })
          }
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, email: e.target.value })
          }
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Add Doctor
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "15px",
        }}
      >
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onDelete={() => handleDeleteDoctor(doctor.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Doctors;
