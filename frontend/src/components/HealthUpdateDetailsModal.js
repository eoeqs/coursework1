import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const HealthUpdateDetailsModal = ({ id, onClose }) => {
    const axiosInstance = useAxiosWithAuth();
    const [healthUpdate, setHealthUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthUpdate = async () => {
            try {
                const response = await axiosInstance.get(`/health/${id}`);
                setHealthUpdate(response.data);
            } catch (error) {
                console.error("Error fetching health update:", error);
                setError("Failed to fetch health update. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHealthUpdate();
    }, [id, axiosInstance]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!healthUpdate) {
        return <div>No health update found.</div>;
    }

    return (
        <div style={modalStyles}>
            <h2>Health Update Details</h2>
            <div>
                <p><strong>Date:</strong> {new Date(healthUpdate.date).toLocaleDateString()}</p>
                <p><strong>Dynamics:</strong> {healthUpdate.dynamics ? "Positive" : "Negative"}</p>
                <p><strong>Symptoms:</strong> {healthUpdate.symptoms || "No symptoms provided."}</p>
                <p><strong>Notes:</strong> {healthUpdate.notes || "No notes provided."}</p>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
};

export default HealthUpdateDetailsModal;