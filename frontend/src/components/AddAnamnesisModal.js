import React, { useState, useEffect } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import "../pinkmodal.css";

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
                const response = await axiosInstance.get(`/appointments/without-anamnesis`);
                const appointmentsWithDetails = await Promise.all(
                    response.data.map(async (appointment) => {
                        const slotResponse = await axiosInstance.get(`/slots/${appointment.slotId}`);
                        return {
                            ...appointment,
                            slot: slotResponse.data,
                        };
                    })
                );
                const filteredAppointments = appointmentsWithDetails.filter(
                    (appointment) => appointment.petId === parseInt(petId, 10)
                );
                setAppointments(filteredAppointments);
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
        <div className="pink-modal-overlay" onClick={onClose}>
            <div className="pink-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="pink-modal-header">
                    <h3 className="pink-modal-header-title">Add New Anamnesis</h3>
                </div>

                {errorMessage && <p className="pink-modal-error">{errorMessage}</p>}
                {successMessage && <p className="pink-modal-success">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="pink-modal-form">
                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="pink-modal-input"
                            placeholder="Enter anamnesis name"
                        />
                    </div>

                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="pink-modal-textarea"
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Appointment:</label>
                        {loading ? (
                            <p>Loading appointments...</p>
                        ) : appointments.length > 0 ? (
                            <select
                                name="appointment"
                                value={formData.appointment}
                                onChange={handleChange}
                                className="pink-modal-select"
                            >
                                <option value="">Select an appointment</option>
                                {appointments.map((appointment) => (
                                    <option key={appointment.id} value={appointment.id}>
                                        {new Date(appointment.slot.date).toLocaleDateString()} - {appointment.slot.startTime}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>No appointments without anamnesis available.</p>
                        )}
                    </div>

                    <div className="pink-modal-footer">
                        <button type="submit" className="pink-modal-action-button">Save</button>
                        <button type="button" onClick={onClose} className="pink-modal-cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAnamnesisModal;