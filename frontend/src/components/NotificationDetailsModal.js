import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const NotificationDetailsModal = ({ notificationId, onClose }) => {
    const axiosInstance = useAxiosWithAuth();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotification = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/notifications/notification/${notificationId}`);
                setNotification(response.data);
            } catch (error) {
                console.error("Error fetching notification details:", error);
                setError("Failed to load notification details.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotification();
    }, [notificationId, axiosInstance]);

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <h3>Notification Details</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : notification ? (
                    <div>
                        <p><strong>Date:</strong> {new Date(notification.dateTime).toLocaleString()}</p>
                        <p><strong>Content:</strong> {notification.content}</p>
                    </div>
                ) : (
                    <p>No notification data found.</p>
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
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
};

export default NotificationDetailsModal;