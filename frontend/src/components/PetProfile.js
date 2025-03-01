import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import EditPetModal from "./EditPetModal";
import AddAnamnesisModal from "./AddAnamnesisModal";
import AddHealthUpdateModal from "./AddHealthUpdateModal";
import PetInfo from "./PetInfo";
import HealthUpdateDetailsModal from "./HealthUpdateDetailsModal";
import Header from "./Header";

const PetProfilePage = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxiosWithAuth();
    const [petInfo, setPetInfo] = useState(null);
    const [anamneses, setAnamneses] = useState([]);
    const [healthUpdates, setHealthUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddAnamnesisModalOpen, setIsAddAnamnesisModalOpen] = useState(false);
    const [isAddHealthUpdateModalOpen, setIsAddHealthUpdateModalOpen] = useState(false);
    const [isHealthUpdateDetailsModalOpen, setIsHealthUpdateDetailsModalOpen] = useState(false);
    const [selectedHealthUpdateId, setSelectedHealthUpdateId] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [isChangeSlotModalOpen, setIsChangeSlotModalOpen] = useState(false); // New state for slot modal
    const [selectedAppointment, setSelectedAppointment] = useState(null); // New state for selected appointment
    const [availableSlots, setAvailableSlots] = useState([]); // New state for available slots
    const [newSlotId, setNewSlotId] = useState(null); // New state for selected slot

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const petResponse = await axiosInstance.get(`/pets/pet/${petId}`);
                setPetInfo(petResponse.data);

                const anamnesesResponse = await axiosInstance.get(`/anamnesis/all-by-patient/${petId}`);
                setAnamneses(anamnesesResponse.data);

                const healthUpdatesResponse = await axiosInstance.get(`/health/all/${petId}`);
                setHealthUpdates(healthUpdatesResponse.data);

                const appointmentsResponse = await axiosInstance.get(`/appointments/upcoming-pet/${petId}`);
                const appointmentsWithDetails = await Promise.all(
                    appointmentsResponse.data.map(async (appointment) => {
                        const slotResponse = await axiosInstance.get(`/slots/${appointment.slotId}`);
                        const slotData = slotResponse.data;

                        const vetResponse = await axiosInstance.get(`/users/user-info/${slotData.vetId}`);
                        const vetName = `${vetResponse.data.name} ${vetResponse.data.surname}`;

                        return {
                            ...appointment,
                            slot: {
                                ...slotData,
                                vetName,
                            },
                        };
                    })
                );
                setUpcomingAppointments(appointmentsWithDetails);

                const treatmentsResponse = await axiosInstance.get(`/treatments/actual-by-pet/${petId}`);
                setTreatments(treatmentsResponse.data);

                const userResponse = await axiosInstance.get("/users/current-user-info");
                setUserRole(userResponse.data.role);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [petId, axiosInstance]);

    const handleSavePet = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/pets/update-pet/${petId}`, updatedData);
            setPetInfo(response.data);
            setIsEditModalOpen(false);
            alert("Pet profile updated successfully!");
        } catch (error) {
            console.error("Error updating pet info:", error);
            alert("Failed to update pet profile. Please try again later.");
        }
    };

    const handleSaveAnamnesis = async (anamnesisData) => {
        try {
            const response = await axiosInstance.post("/anamnesis/save", {
                ...anamnesisData,
                pet: petId,
                appointment: anamnesisData.appointment,
            });
            setAnamneses([...anamneses, response.data]);
            setIsAddAnamnesisModalOpen(false);
            alert("Anamnesis saved successfully!");
        } catch (error) {
            console.error("Error saving anamnesis:", error);
            alert("Failed to save anamnesis. Please try again later.");
        }
    };

    const handleSaveHealthUpdate = async (healthUpdateData) => {
        try {
            const response = await axiosInstance.post("/health/save", healthUpdateData);
            setHealthUpdates([...healthUpdates, response.data]);
            setIsAddHealthUpdateModalOpen(false);
            alert("Health update saved successfully!");
        } catch (error) {
            console.error("Error saving health update:", error);
            alert("Failed to save health update. Please try again later.");
        }
    };

    const handleViewHealthUpdateDetails = (id) => {
        setSelectedHealthUpdateId(id);
        setIsHealthUpdateDetailsModalOpen(true);
    };

    const openChangeSlotModal = (appointment) => {
        setSelectedAppointment(appointment);
        fetchAvailableSlots();
        setIsChangeSlotModalOpen(true);
    };

    const closeChangeSlotModal = () => {
        setIsChangeSlotModalOpen(false);
        setSelectedAppointment(null);
        setAvailableSlots([]);
        setNewSlotId(null);
    };

    const fetchAvailableSlots = async () => {
        try {
            const response = await axiosInstance.get("/slots/available-priority-slots");
            setAvailableSlots(response.data);
        } catch (error) {
            console.error("Error fetching available slots:", error);
            alert("Failed to fetch available slots.");
        }
    };

    const handleChangeSlot = async () => {
        if (!newSlotId) {
            alert("Please select a new slot.");
            return;
        }

        try {
            // Book the new slot
            await axiosInstance.put(`/slots/book-slot/${newSlotId}`);
            // Release the old slot
            await axiosInstance.put(`/slots/release-slot/${selectedAppointment.slotId}`);
            // Update the appointment with the new slot
            await axiosInstance.put(`/appointments/update-appointment/${selectedAppointment.id}`, null, {
                params: { slotId: newSlotId },
            });

            // Update local state
            const updatedAppointments = upcomingAppointments.map((app) =>
                app.id === selectedAppointment.id ? { ...app, slotId: newSlotId } : app
            );
            setUpcomingAppointments(updatedAppointments);

            alert("Appointment slot changed successfully!");
            closeChangeSlotModal();
        } catch (error) {
            console.error("Error changing slot:", error);
            alert("Failed to change slot.");
        }
    };

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    if (!petInfo) {
        return <div>No pet information found.</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mt-2" style={{ display: "flex", gap: "100px" }}>
                <div className="ps-3">
                    <PetInfo petInfo={petInfo} onEdit={() => setIsEditModalOpen(true)} />

                    <div
                        className="bg-treatment container mt-3 rounded-1 upcoming-appointments"
                        style={{ padding: "20px" }}
                    >
                        <h4>Upcoming Appointments</h4>
                        {upcomingAppointments.length > 0 ? (
                            <table cellPadding="3" cellSpacing="0" className="uniq-table">
                                <tbody>
                                {upcomingAppointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{new Date(appointment.slot.date).toLocaleDateString()}</td>
                                        <td>{appointment.slot.startTime.slice(0, 5)}</td>
                                        <td>-</td>
                                        <td>Dr. {appointment.slot.vetName}</td>
                                        <td>
                                            {userRole === "ROLE_ADMIN" && appointment.priority && (
                                                <button
                                                    className="button btn-no-border"
                                                    onClick={() => openChangeSlotModal(appointment)}
                                                >
                                                    Change Slot
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No upcoming appointments found.</p>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <h2>Anamneses</h2>
                    <div className="bg-table element-space">
                        {anamneses.length > 0 ? (
                            <table cellPadding="5" cellSpacing="0" className="uniq-table">
                                <tbody>
                                {anamneses.map((anamnesis) => (
                                    <tr key={anamnesis.id}>
                                        <td>{new Date(anamnesis.date).toLocaleDateString()}</td>
                                        <td>{anamnesis.description}</td>
                                        <td>
                                            <button
                                                className="button btn-no-border"
                                                onClick={() => navigate(`/anamnesis/${anamnesis.id}`)}
                                            >
                                                More info
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No anamneses found.</p>
                        )}
                        {userRole === "ROLE_VET" && (
                            <button
                                className="button rounded-3 btn-no-border"
                                onClick={() => setIsAddAnamnesisModalOpen(true)}
                            >
                                Add New Anamnesis
                            </button>
                        )}
                    </div>

                    <h2>Health Updates</h2>
                    <div className="bg-table">
                        {healthUpdates.length > 0 ? (
                            <table cellPadding="5" cellSpacing="0" className="uniq-table">
                                <tbody>
                                {healthUpdates.map((update) => (
                                    <tr key={update.id}>
                                        <td>{new Date(update.date).toLocaleDateString()}</td>
                                        <td>{update.dynamics ? "positive" : "negative"} dynamic</td>
                                        <td>
                                            <button
                                                className="button btn-no-border"
                                                onClick={() => handleViewHealthUpdateDetails(update.id)}
                                            >
                                                More info
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No health updates found.</p>
                        )}
                        <button
                            className="button rounded-3 btn-no-border"
                            onClick={() => setIsAddHealthUpdateModalOpen(true)}
                        >
                            Add Health Update
                        </button>
                    </div>
                </div>

                <div className="bg-treatment mt-1 rounded-1" style={{ padding: "20px" }}>
                    <h4>Treatment Recommendations</h4>
                    {treatments.length > 0 ? (
                        <table cellPadding="3" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {treatments.map((treatment) => (
                                <tr key={treatment.id}>
                                    <td>
                                        <b>Treatment</b>: {treatment.name} <br />
                                        <b>Description</b>: {treatment.description} <br />
                                        <b>Prescribed Medication</b>: {treatment.prescribedMedication} <br />
                                        <b>Duration</b>: {treatment.duration} <br />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No treatment recommendations found.</p>
                    )}
                </div>

                {isEditModalOpen && (
                    <EditPetModal
                        petInfo={petInfo}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSavePet}
                    />
                )}

                {isAddAnamnesisModalOpen && (
                    <AddAnamnesisModal
                        petId={petId}
                        onClose={() => setIsAddAnamnesisModalOpen(false)}
                        onSave={handleSaveAnamnesis}
                    />
                )}

                {isAddHealthUpdateModalOpen && (
                    <AddHealthUpdateModal
                        petId={petId}
                        onClose={() => setIsAddHealthUpdateModalOpen(false)}
                        onSave={handleSaveHealthUpdate}
                    />
                )}

                {isHealthUpdateDetailsModalOpen && (
                    <HealthUpdateDetailsModal
                        id={selectedHealthUpdateId}
                        onClose={() => setIsHealthUpdateDetailsModalOpen(false)}
                    />
                )}

                {isChangeSlotModalOpen && (
                    <div style={modalOverlayStyles}>
                        <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                            <h3>Change Appointment Slot</h3>
                            {availableSlots.length > 0 ? (
                                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {availableSlots.map((slot) => (
                                        <div key={slot.id} style={{ marginBottom: "10px" }}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="newSlot"
                                                    value={slot.id}
                                                    checked={newSlotId === slot.id}
                                                    onChange={() => setNewSlotId(slot.id)}
                                                />
                                                {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No available priority slots found.</p>
                            )}
                            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                                <button onClick={handleChangeSlot} disabled={!newSlotId}>
                                    Confirm Change
                                </button>
                                <button onClick={closeChangeSlotModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
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

export default PetProfilePage;