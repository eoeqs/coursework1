import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import myImage from "../pics/logo_min.png";
import NotificationsModal from "./NotificationsModal";
import NotificationDetailsModal from "./NotificationDetailsModal";
import '../header.css';

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
    const menuRef = useRef(null);
    const sidebarRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutsideMenu = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutsideMenu);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideMenu);
        };
    }, [menuOpen]);

    useEffect(() => {
        const handleClickOutsideSidebar = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener("mousedown", handleClickOutsideSidebar);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideSidebar);
        };
    }, [sidebarOpen]);

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
            <div ref={menuRef} className="menu-dropdown">
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
                <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <button onClick={() => handleMenuItemClick("/")}>Main Page</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/my-pets")}>My Pets</button>
                    <div className="divider"></div>
                </div>
            );
        } else if (userRole === "ROLE_VET") {
            return (
                <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <button onClick={() => handleMenuItemClick("/")}>Main Page</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/my-wards")}>My Wards</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/quarantine-management")}>Quarantine Manager</button>
                    <div className="divider"></div>
                </div>
            );
        } else if (userRole === "ROLE_ADMIN") {
            return (
                <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <button onClick={() => handleMenuItemClick("/")}>Main Page</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/all-pets")}>All Pets</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/all-vets")}>All Vets</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/all-pet-owners")}>All Pet Owners</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/quarantine-management")}>Quarantine Manager</button>
                    <div className="divider"></div>
                    <button onClick={() => handleMenuItemClick("/sector-management")}>Sector Management</button>
                    <div className="divider"></div>
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
        </>
    );
}