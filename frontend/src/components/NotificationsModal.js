import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const NotificationsModal = ({ userId, onClose, onOpenNotification }) => {
    const axiosInstance = useAxiosWithAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/notifications/all/${userId}`);
                console.log(response.data)
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError("Failed to load notifications.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, axiosInstance]);

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <h3>Notifications</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : notifications.length > 0 ? (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <table cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
                            <tbody>
                            {notifications.map((notification) => (
                                <tr
                                    key={notification.id}
                                    onClick={() => onOpenNotification(notification.id)}
                                    style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
                                >
                                    <td>{new Date(notification.dateTime).toLocaleString()}</td>
                                    <td>{notification.content.substring(0, 50)}...</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No notifications found.</p>
                )}
                <button onClick={onClose} style={{ marginTop: "20px" }}>Close</button>
            </div>
        </div>
    );
};

const modalOverlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalStyles = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
};

export default NotificationsModal;