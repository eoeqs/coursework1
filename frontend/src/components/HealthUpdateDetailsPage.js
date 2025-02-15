import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";

const HealthUpdateDetailsPage = () => {
    const { id } = useParams();
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
        <div>
            <h2>Health Update Details</h2>
            <div>
                <p><strong>Date:</strong> {new Date(healthUpdate.date).toLocaleDateString()}</p>
                <p><strong>Dynamics:</strong> {healthUpdate.dynamics ? "Positive" : "Negative"}</p>
                <p><strong>Symptoms:</strong> {healthUpdate.symptoms || "No symptoms provided."}</p>
                <p><strong>Notes:</strong> {healthUpdate.notes || "No notes provided."}</p>
            </div>
            <button onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default HealthUpdateDetailsPage;