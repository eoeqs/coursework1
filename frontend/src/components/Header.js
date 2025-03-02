import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import myImage from "../pics/logo_min.png";

export default function Header() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const isAuthenticated = !!token; // Check if token exists
    const [menuOpen, setMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const axiosInstance = useAxiosWithAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUserRole = async () => {
                try {
                    const response = await axiosInstance.get("/users/current-user-info");
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            };
            fetchUserRole();
        } else {
            setUserRole(null);
        }
    }, [isAuthenticated, axiosInstance]);

    const handleProfileClick = () => {
        if (isAuthenticated) {
            setMenuOpen(!menuOpen);
        } else {
            navigate("/login");
        }
    };

    const handleMenuItemClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleProfile = () => {
        if (userRole === "ROLE_VET") {
            navigate("/vet-dashboard");
        } else if (userRole === "ROLE_OWNER") {
            navigate("/owner-dashboard");
        } else if (userRole === "ROLE_ADMIN") {
            navigate("/admin-dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <header className="header">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={myImage}
                    alt="VetCare Logo"
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                />
                <h1 style={{ marginLeft: "10px" }} onClick={() => navigate("/")}>
                    VetCare
                </h1>
            </div>
            <div>
                <button
                    className="btn btn-pink p-2"
                    style={{ borderRadius: "100%", border: "none" }}
                    onClick={handleProfileClick}
                >
                    <FaUserCircle size={40} />
                </button>

                {menuOpen && isAuthenticated && (
                    <div className="menu-dropdown">
                        <button onClick={handleProfile}>Profile</button>
                        <button onClick={() => handleMenuItemClick("/notifications")}>Notifications</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
}