import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HeroHome from "./pages/HeroHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorProfile from "./pages/DoctorProfile";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ paddingTop: 'var(--header-height)' }}>
          <Header />
          <Routes>
            <Route path="/" element={<HeroHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />
            <Route path="/patients" element={<Patients />} />
            <Route
              path="/patient-profile/:patientId"
              element={<PatientProfile />}
            />
            <Route path="/user-profile/:id" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
