import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";

const AnamnesisDetailsPage = () => {
    const { id } = useParams();
    const axiosInstance = useAxiosWithAuth();
    const [anamnesis, setAnamnesis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnamnesisDetails = async () => {
            try {
                const response = await axiosInstance.get(`/anamnesis/${id}`);
                setAnamnesis(response.data);
            } catch (error) {
                console.error("Error fetching anamnesis details:", error);
                setError("Failed to fetch anamnesis details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnamnesisDetails();
    }, [id, axiosInstance]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!anamnesis) {
        return <div>No anamnesis found.</div>;
    }

    return (
        <div>
            <h2>Anamnesis Details</h2>
            <div>
                <p><strong>Date:</strong> {new Date(anamnesis.date).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {anamnesis.description}</p>
            </div>
            <button onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default AnamnesisDetailsPage;