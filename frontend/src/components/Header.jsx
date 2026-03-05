import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    FaHospital,
    FaSignOutAlt,
    FaArrowLeft,
    FaUserCircle,
    FaUserMd
} from "react-icons/fa";
import "../styles/Header.css";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = location.pathname === "/";

    // Navigation Links
    const navLinks = [
        { name: "Find Doctors", path: "/doctors", show: true },
        { name: "Patients", path: "/patients", show: true },
    ];

    return (
        <header className={`fixed-header ${scrolled ? "scrolled" : ""}`}>
            <div className="logo-section">
                {/* Back Button - Show if not on Home */}
                {!isHome && (
                    <button
                        onClick={() => navigate("/")}
                        className="header-back-btn"
                        title="Back to Home"
                    >
                        <FaArrowLeft />
                        <span>Back Home</span>
                    </button>
                )}

                {/* Logo */}
                <Link to="/" className="app-logo">
                    <FaHospital style={{ fontSize: '22px' }} />
                    <span>MediCare</span>
                </Link>
            </div>

            <nav className="header-actions">
                {/* Desktop Navigation Links */}
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`nav-link-item ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        {link.name}
                    </Link>
                ))}

                {isAuthenticated ? (
                    <>
                        <Link
                            to={user?.userType === "doctor" ? `/doctor-profile/${user?.id}` : `/user-profile/${user?.id}`}
                            className="nav-link-item"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {user?.userType === "doctor" ? <FaUserMd /> : <FaUserCircle />}
                            <span>{user?.name?.split(' ')[0]}</span>
                        </Link>

                        <button
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                            className="header-logout-btn"
                            title="Logout"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="nav-link-item">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
