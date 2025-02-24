import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";

export default function Header() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const isAuthenticated = token !== null;
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
        }
    }, [isAuthenticated, axiosInstance]);

    const handleProfileClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuItemClick = (path) => {
        setMenuOpen(false);
        if (path === "/profile" && !isAuthenticated) {
            navigate("/login");
        } else {
            navigate(path);
        }
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
        } else {
            navigate("/");
        }
    };

    return (
        <header>
            <h1 onClick={() => navigate("/")}>
                VetCare
            </h1>

            <div>
                <button onClick={handleProfileClick}>
                    <FaUserCircle />
                </button>

                {menuOpen && (
                    <div>
                        <button onClick={handleProfile}>
                            Profile
                        </button>
                        <button onClick={() => handleMenuItemClick("/notifications")}>
                            Notifications
                        </button>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}