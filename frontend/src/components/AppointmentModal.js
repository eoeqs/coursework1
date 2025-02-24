import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";

const AppointmentModal = ({ appointment, onClose }) => {
    const axiosInstance = useAxiosWithAuth();
    const [petType, setPetType] = useState(null);
    const [bodyMarker, setBodyMarker] = useState(null);
    const [tempMarker, setTempMarker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vetInfo, setVetInfo] = useState(null); // Состояние для хранения информации о ветеринаре

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petResponse = await axiosInstance.get(`/pets/pet/${appointment.petId}`);
                setPetType(petResponse.data.type);

                const markerResponse = await axiosInstance.get(`/body-marker/appointment/${appointment.id}`);
                setBodyMarker(markerResponse.data);
                setTempMarker(markerResponse.data);

                if (appointment.slot && appointment.slot.vetId) {
                    const vetResponse = await axiosInstance.get(`/users/user-info/${appointment.slot.vetId}`);
                    setVetInfo(vetResponse.data); // Сохраняем данные о ветеринаре
                }
            } catch (error) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        if (appointment) fetchData();
    }, [appointment, axiosInstance]);

    const handleBodyMark = (mark) => {
        setTempMarker({
            bodyPart: mark.part,
            positionX: mark.x,
            positionY: mark.y,
            appointment: appointment.id,
            pet: appointment.petId,
        });
    };

    const handleSave = async () => {
        try {
            if (tempMarker) {
                if (bodyMarker) {
                    const response = await axiosInstance.put(
                        `/body-marker/update/${bodyMarker.id}`,
                        tempMarker
                    );
                    setBodyMarker(response.data);
                } else {
                    const response = await axiosInstance.post("/body-marker/save", tempMarker);
                    setBodyMarker(response.data);
                }
                alert("Marker saved successfully!");
            }
        } catch (error) {
            console.error("Error saving marker:", error);
            alert("Failed to save marker.");
        }
    };

    if (!appointment || loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={modalStyles}>
            <h3>Appointment Details</h3>
            <p><strong>Description:</strong> {appointment.description}</p>
            <p><strong>Priority:</strong> {appointment.priority ? "Yes" : "No"}</p>

            {appointment.slot && (
                <div>
                    <p><strong>Date:</strong> {new Date(appointment.slot.date).toLocaleDateString()}</p>
                    <p><strong>Start Time:</strong> {appointment.slot.startTime}</p>
                    <p><strong>End Time:</strong> {appointment.slot.endTime}</p>
                    <p><strong>Vet:</strong> {vetInfo ? `${vetInfo.name} ${vetInfo.surname}` : "Unknown"}</p>
                </div>
            )}

            <div style={{ margin: "20px 0" }}>
                {petType === "DOG" ? (
                    <DogBodyMap
                        onMark={handleBodyMark}
                        initialMarker={tempMarker}
                    />
                ) : petType === "CAT" ? (
                    <CatBodyMap
                        onMark={handleBodyMark}
                        initialMarker={tempMarker}
                    />
                ) : (
                    <p>Unknown animal type</p>
                )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={handleSave}>Save</button>
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