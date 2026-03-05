import axios from "axios";

const API_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Patients API
export const patientsAPI = {
  getAll: () => apiClient.get("/patients"),
  getById: (id) => apiClient.get(`/patients/${id}`),
  create: (data) => apiClient.post("/patients", data),
  update: (id, data) => apiClient.put(`/patients/${id}`, data),
  delete: (id) => apiClient.delete(`/patients/${id}`),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => apiClient.get("/doctors"),
  getById: (id) => apiClient.get(`/doctors/${id}`),
  create: (data) => apiClient.post("/doctors", data),
  update: (id, data) => apiClient.put(`/doctors/${id}`, data),
  delete: (id) => apiClient.delete(`/doctors/${id}`),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => apiClient.get("/appointments"),
  getById: (id) => apiClient.get(`/appointments/${id}`),
  create: (data) => apiClient.post("/appointments", data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  delete: (id) => apiClient.delete(`/appointments/${id}`),
};

export default apiClient;
