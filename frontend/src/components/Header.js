import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import myImage from "../pics/logo_min.png";
import NotificationsModal from "./NotificationsModal";
import NotificationDetailsModal from "./NotificationDetailsModal";

export default function Header() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const isAuthenticated = !!token;
    const [menuOpen, setMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isNotificationDetailsModalOpen, setIsNotificationDetailsModalOpen] = useState(false);
    const [selectedNotificationId, setSelectedNotificationId] = useState(null);
    const axiosInstance = useAxiosWithAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axiosInstance.get("/users/current-user-info");
                    setUserRole(response.data.role);
                    setUserId(response.data.id);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            };
            fetchUserInfo();
        } else {
            setUserRole(null);
            setUserId(null);
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

    const openNotificationsModal = () => {
        setMenuOpen(false);
        setIsNotificationsModalOpen(true);
    };

    const closeNotificationsModal = () => {
        setIsNotificationsModalOpen(false);
    };

    const openNotificationDetailsModal = (notificationId) => {
        setSelectedNotificationId(notificationId);
        setIsNotificationDetailsModalOpen(true);
    };

    const closeNotificationDetailsModal = () => {
        setIsNotificationDetailsModalOpen(false);
        setSelectedNotificationId(null);
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
                        <button onClick={openNotificationsModal}>Notifications</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>

            {isNotificationsModalOpen && (
                <NotificationsModal
                    userId={userId}
                    onClose={closeNotificationsModal}
                    onOpenNotification={openNotificationDetailsModal}
                />
            )}

            {isNotificationDetailsModalOpen && (
                <NotificationDetailsModal
                    notificationId={selectedNotificationId}
                    onClose={closeNotificationDetailsModal}
                />
            )}
        </header>
    );
}