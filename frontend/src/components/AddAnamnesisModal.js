import React, { useState, useEffect } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const AddAnamnesisModal = ({ petId, onClose, onSave }) => {
    const axiosInstance = useAxiosWithAuth();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        appointment: "",
    });
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/appointments/upcoming-pet/${petId}`);
                const appointmentsWithDetails = await Promise.all(
                    response.data.map(async (appointment) => {
                        const slotResponse = await axiosInstance.get(`/slots/${appointment.slotId}`);
                        return {
                            ...appointment,
                            slot: slotResponse.data,
                        };
                    })
                );
                setAppointments(appointmentsWithDetails);
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setErrorMessage("Failed to load appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [petId, axiosInstance]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setErrorMessage("Name is required.");
            return;
        }
        if (!formData.description.trim()) {
            setErrorMessage("Description is required.");
            return;
        }
        if (!formData.appointment) {
            setErrorMessage("Please select an appointment.");
            return;
        }

        setErrorMessage("");

        try {
            const anamnesisData = {
                name: formData.name,
                description: formData.description,
                pet: petId,
                appointment: parseInt(formData.appointment, 10),
            };
            await onSave(anamnesisData);
            setSuccessMessage("Anamnesis added successfully.");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error saving anamnesis:", error);
            setErrorMessage("Failed to add anamnesis. Please try again.");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
            }}
        >
            <h3>Add New Anamnesis</h3>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Appointment:</label>
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length > 0 ? (
                        <select
                            name="appointment"
                            value={formData.appointment}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "5px" }}
                        >
                            <option value="">Select an appointment</option>
                            {appointments.map((appointment) => (
                                <option key={appointment.id} value={appointment.id}>
                                    {new Date(appointment.slot.date).toLocaleDateString()} - {appointment.slot.startTime}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>No upcoming appointments available.</p>
                    )}
                </div>

                <button type="submit" style={{ marginRight: "10px" }}>
                    Save
                </button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddAnamnesisModal;