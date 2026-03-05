import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profileImage: null,
    role: "patient", // Default role
    specialization: "", // For doctors only
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain a number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\d\s\-\+()]+$/.test(formData.phone) ||
      formData.phone.replace(/\D/g, "").length < 10
    ) {
      newErrors.phone = "Invalid phone number";
    }

    // Validate profile image for both roles (optional or required based on preference, making it required for consistency)
    if (!formData.profileImage) {
      newErrors.profileImage = "Profile image is required";
    }

    // Validate specialization if role is doctor
    if (formData.role === "doctor" && !formData.specialization) {
      newErrors.specialization = "Specialization is required for doctors";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please select an image file",
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size must not exceed 5 MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result, // Store as base64
        }));
        setImagePreview(reader.result);
        setErrors((prev) => ({
          ...prev,
          profileImage: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (formData.role === "doctor") {
        // Create new doctor in API
        const newDoctor = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          bio: `Experienced ${formData.specialization} specialist`,
          rating: 4.5,
          experience: "5 Years",
          patients: 0,
          image: imagePreview || "", // Use the uploaded image
        };

        console.log("Creating doctor:", newDoctor);

        const response = await fetch("http://localhost:3000/doctors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDoctor),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }
          throw new Error(errorData.message || `Registration failed: ${response.status} ${response.statusText}`);
        }

        const createdDoctor = await response.json();
        console.log("Created doctor:", createdDoctor);

        // Register with complete doctor data including ID
        register({
          id: createdDoctor.id,
          name: createdDoctor.name,
          email: createdDoctor.email,
          phone: createdDoctor.phone,
          specialization: createdDoctor.specialization,
          userType: "doctor",
        });
        setLoading(false);
        // Navigate to doctor profile
        navigate(`/doctor-profile/${createdDoctor.id}`);
      } else {
        // Create new patient in API
        const newPatient = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: 0,
          gender: "",
          profileImage: imagePreview,
        };

        console.log("Creating patient:", { ...newPatient, profileImage: imagePreview ? "Image present" : "No image" });

        const response = await fetch("http://localhost:3000/patients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPatient),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }
          throw new Error(errorData.message || `Registration failed: ${response.status} ${response.statusText}`);
        }

        const createdPatient = await response.json();
        console.log("Created patient:", createdPatient);

        // Register with complete patient data including ID
        register({
          id: createdPatient.id,
          name: createdPatient.name,
          email: createdPatient.email,
          phone: createdPatient.phone,
          age: createdPatient.age,
          gender: createdPatient.gender,
          profileImage: createdPatient.profileImage,
          userType: "patient",
        });
        setLoading(false);
        // Navigate to user profile
        navigate(`/user-profile/${createdPatient.id}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Error creating account. Please try again.";

      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMessage = "Cannot connect to server. Please make sure the backend server is running on http://localhost:3000";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

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
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? "input-error" : ""}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            {errors.role && (
              <span className="field-error">{errors.role}</span>
            )}
          </div>

          {formData.role === "doctor" && (
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Cardiology, Neurology, Pediatrics"
                className={errors.specialization ? "input-error" : ""}
              />
              {errors.specialization && (
                <span className="field-error">{errors.specialization}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="profileImage">Profile Picture</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Image preview" />
                </div>
              )}
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className={`file-input ${errors.profileImage ? "input-error" : ""
                  }`}
              />
              <label htmlFor="profileImage" className="file-label">
                📷 Choose Profile Picture
              </label>
            </div>
            {errors.profileImage && (
              <span className="field-error">{errors.profileImage}</span>
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
              placeholder="Enter password (uppercase + number)"
              className={errors.password ? "input-error" : ""}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={errors.confirmPassword ? "input-error" : ""}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
