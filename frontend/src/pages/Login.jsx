import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get both patients and doctors
      const [patientsRes, doctorsRes] = await Promise.all([
        fetch("http://localhost:3000/patients"),
        fetch("http://localhost:3000/doctors"),
      ]);

      const patients = await patientsRes.json();
      const doctorsList = await doctorsRes.json();

      const foundPatient = patients.find(
        (p) => p.email.toLowerCase() === formData.email.toLowerCase()
      );

      const foundDoctor = doctorsList.find(
        (d) => d.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (foundPatient) {
        // مريض
        login({
          id: foundPatient.id,
          name: foundPatient.name,
          email: foundPatient.email,
          phone: foundPatient.phone,
          age: foundPatient.age,
          gender: foundPatient.gender,
          profileImage: foundPatient.profileImage,
          userType: "patient",
        });
        setLoading(false);
        navigate(`/user-profile/${foundPatient.id}`);
        return;
      }

      if (foundDoctor) {
        // طبيب
        login({
          id: foundDoctor.id,
          name: foundDoctor.name,
          email: foundDoctor.email,
          phone: foundDoctor.phone,
          specialization: foundDoctor.specialization,
          userType: "doctor",
        });
        setLoading(false);
        navigate(`/doctor-profile/${foundDoctor.id}`);
        return;
      }

      setErrors({ submit: "Email or password incorrect" });
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      if (error.message?.includes("Failed to fetch")) {
        setErrors({ submit: "Cannot connect to server. Please make sure the backend server is running." });
      } else {
        setErrors({ submit: "Login failed. Please try again." });
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
