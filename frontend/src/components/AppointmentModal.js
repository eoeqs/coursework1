import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";

const AppointmentModal = ({ appointment, onClose }) => {
    const axiosInstance = useAxiosWithAuth();
    const [petType, setPetType] = useState(null);
    const [bodyMarker, setBodyMarker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ownerInfo, setOwnerInfo] = useState(null);
    const [petInfo, setPetInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petResponse = await axiosInstance.get(`/pets/pet/${appointment.petId}`);
                setPetType(petResponse.data.type);
                setPetInfo(petResponse.data);

                const ownerResponse = await axiosInstance.get(`/users/user-info/${petResponse.data.owner}`);
                setOwnerInfo(ownerResponse.data);

                const markerResponse = await axiosInstance.get(`/body-marker/appointment/${appointment.id}`);
                setBodyMarker(markerResponse.data);
            } catch (error) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        if (appointment) fetchData();
    }, [appointment, axiosInstance]);

    if (!appointment || loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={modalStyles}>
            <h3>Appointment Details</h3>
            <p><strong>Priority:</strong> {appointment.priority ? "Yes" : "No"}</p>
            <p><strong>Owner Name:</strong> {ownerInfo ? `${ownerInfo.name} ${ownerInfo.surname}` : "Unknown"}</p>
            <p><strong>Pet Name:</strong> {petInfo?.name}</p>
            <p><strong>Pet Type:</strong> {petInfo?.type}</p>
            <p><strong>Complaints:</strong> {appointment.description}</p>
            <p><strong>Date:</strong> {new Date(appointment.slot.date).toLocaleDateString()}</p>

            <div style={{ margin: "20px 0" }}>
                {petType === "DOG" ? (
                    <DogBodyMap initialMarker={bodyMarker} readOnly={true} />
                ) : petType === "CAT" ? (
                    <CatBodyMap initialMarker={bodyMarker} readOnly={true}/>
                ) : (
                    <p>Unknown animal type</p>
                )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onClose}>Close</button>
            </div>
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
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    maxWidth: "600px",
    width: "90%",
};

export default AppointmentModal;