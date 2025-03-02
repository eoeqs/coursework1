import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuItemClick = (path) => {
        setMenuOpen(false);
        setSidebarOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const openNotificationsModal = () => {
        setMenuOpen(false);
        setSidebarOpen(false);
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

    const renderProfileMenu = () => {
        if (!isAuthenticated) return null;

        let profilePath = "/";
        if (userRole === "ROLE_OWNER") profilePath = "/owner-dashboard";
        else if (userRole === "ROLE_VET") profilePath = "/vet-dashboard";
        else if (userRole === "ROLE_ADMIN") profilePath = "/admin-dashboard";

        return (
            <div className="menu-dropdown">
                <button onClick={() => handleMenuItemClick(profilePath)}>My Profile</button>
                <button onClick={openNotificationsModal}>Notifications</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    };

    const renderSidebarMenu = () => {
        if (!isAuthenticated) return null;

        if (userRole === "ROLE_OWNER") {
            return (
                <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <button className="close-sidebar" onClick={handleSidebarToggle}>×</button>
                    <button onClick={() => handleMenuItemClick("/")}>Main Page</button>
                    <button onClick={() => handleMenuItemClick("/my-pets")}>My Pets</button>
                </div>
            );
        } else if (userRole === "ROLE_VET") {
            return (
                <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <button className="close-sidebar" onClick={handleSidebarToggle}>×</button>
                    <button onClick={() => handleMenuItemClick("/")}>Main Page</button>
                    <button onClick={() => handleMenuItemClick("/my-wards")}>My Wards</button>
                    <button onClick={() => handleMenuItemClick("/quarantine-management")}>Quarantine Manager</button>
                </div>
            );
        } else if (userRole === "ROLE_ADMIN") {
            return (
                <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <button className="close-sidebar" onClick={handleSidebarToggle}>×</button>
                    <button onClick={() => handleMenuItemClick("/")}>Main Page</button>
                    <button onClick={() => handleMenuItemClick("/all-pets")}>All Pets</button>
                    <button onClick={() => handleMenuItemClick("/all-vets")}>All Vets</button>
                    <button onClick={() => handleMenuItemClick("/all-pet-owners")}>All Pet Owners</button>
                    <button onClick={() => handleMenuItemClick("/quarantine-management")}>Quarantine Manager</button>
                    <button onClick={() => handleMenuItemClick("/sector-management")}>Sector Management</button>
                </div>
            );
        }
        return null;
    };

    return (
        <>
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
                <div style={{ display: "flex", alignItems: "center" }}>
                    {isAuthenticated && (
                        <button
                            className="btn btn-pink p-2"
                            style={{ borderRadius: "100%", border: "none", marginRight: "10px" }}
                            onClick={handleSidebarToggle}
                        >
                            <FaBars size={30} />
                        </button>
                    )}
                    <button
                        className="btn btn-pink p-2"
                        style={{ borderRadius: "100%", border: "none" }}
                        onClick={handleProfileClick}
                    >
                        <FaUserCircle size={40} />
                    </button>
                    {menuOpen && renderProfileMenu()}
                </div>

                {renderSidebarMenu()}

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

            <style jsx>{`
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 20px;
                    background-color: #f8f8f8;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                }

                .menu-dropdown {
                    position: absolute;
                    top: 60px;
                    right: 20px;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1001;
                }

                .menu-dropdown button {
                    display: block;
                    width: 100%;
                    padding: 10px 20px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                }

                .menu-dropdown button:hover {
                    background-color: #f0f0f0;
                }

                .sidebar {
                    position: fixed;
                    top: 0;
                    right: -300px;
                    width: 300px;
                    height: 100%;
                    background-color: #fff;
                    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
                    transition: right 0.3s ease-in-out;
                    z-index: 1002;
                    padding: 20px;
                }

                .sidebar.open {
                    right: 0;
                }

                .sidebar button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    font-size: 16px;
                }

                .sidebar button:hover {
                    background-color: #f0f0f0;
                }

                .close-sidebar {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                    background: none;
                    border: none;
                    cursor: pointer;
                }

                .btn-pink {
                    color: #fff;
                    background-color: #ff6f61;
                }

                .btn-pink:hover {
                    background-color: #e65b50;
                }
            `}</style>
        </>
    );
}