import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import "../pinkmodal.css";

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
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    if (!healthUpdate) {
        return <div>No health update found.</div>;
    }

    return (
        <div className="pink-modal-overlay" onClick={onClose}>
            <div className="pink-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="pink-modal-header">
                    <h2 className="pink-modal-header-title">Health Update Details</h2>
                </div>
                <div className="pink-modal-details">
                    <p><strong>Date:</strong> {new Date(healthUpdate.date).toLocaleDateString()}</p>
                    <p><strong>Dynamics:</strong> {healthUpdate.dynamics ? "Positive" : "Negative"}</p>
                    <p><strong>Symptoms:</strong> {healthUpdate.symptoms || "No symptoms provided."}</p>
                    <p><strong>Notes:</strong> {healthUpdate.notes || "No notes provided."}</p>
                </div>
            </div>
        </div>
    );
};

export default HealthUpdateDetailsModal;