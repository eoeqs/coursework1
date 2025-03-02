import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import PetProfile from "./PetProfile";
import { useNavigate } from "react-router-dom";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";
import Header from "./Header";
import VetImage from "../pics/vet.png";
import EditOwnerModal from "./EditOwnerModal";

const VetDashboard = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const [vetInfo, setVetInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [createAnamnesis, setCreateAnamnesis] = useState(false);
    const [doctorPets, setDoctorPets] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const navigate = useNavigate();
    const [bodyMarker, setBodyMarker] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const currentUserResponse = await axiosInstance.get("/users/current-user-info");
                const fetchedVetId = currentUserResponse.data.id;
                const fetchedUserRole = currentUserResponse.data.role;
                setUserRole(fetchedUserRole);

                const vetInfoResponse = await axiosInstance.get(`/users/user-info/${fetchedVetId}`);
                setVetInfo(vetInfoResponse.data);

                if (fetchedUserRole === "ROLE_VET") {
                    const doctorPetsResponse = await axiosInstance.get(`/pets/doctor-pets/${vetInfoResponse.data.id}`);
                    setDoctorPets(doctorPetsResponse.data);
                }

                const appointmentsResponse = await axiosInstance.get(`/appointments/upcoming-vet/${vetInfoResponse.data.id}`);
                const appointmentPromises = appointmentsResponse.data.map(async (appointment) => {
                    const [slotResponse, petResponse] = await Promise.all([
                        axiosInstance.get(`/slots/${appointment.slotId}`),
                        axiosInstance.get(`/pets/pet/${appointment.petId}`),
                    ]);
                    return {
                        ...appointment,
                        slot: slotResponse.data,
                        pet: petResponse.data,
                    };
                });

                const appointmentsWithDetails = await Promise.all(appointmentPromises);
                setAppointments(appointmentsWithDetails);
            } catch (error) {
                console.error("Error fetching vet data or appointments:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, axiosInstance]);

    const handleView = async (appointmentId) => {
        try {
            const appointment = appointments.find((app) => app.id === appointmentId);
            if (!appointment) {
                throw new Error("Appointment not found");
            }
            const markerResponse = await axiosInstance.get(`/body-marker/appointment/${appointmentId}`);
            setBodyMarker(markerResponse.data);
            const appointmentResponse = await axiosInstance.get(`/appointments/appointment/${appointmentId}`);
            const appointmentData = appointmentResponse.data;

            const slotResponse = await axiosInstance.get(`/slots/${appointmentData.slotId}`);
            const slotData = slotResponse.data;

            const petData = appointment.pet;

            const ownerResponse = await axiosInstance.get(`/users/user-info/${petData.owner}`);
            const ownerName = ownerResponse.data.name;
            setSelectedAppointment({
                ...appointmentData,
                slot: slotData,
                pet: petData,
                ownerName: ownerName,
            });
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            setError("Failed to fetch appointment details. Please try again later.");
        }
    };

    const closeModal = () => {
        setSelectedAppointment(null);
        setCreateAnamnesis(false);
    };

    const handleApprove = async () => {
        if (!selectedAppointment) return;

        try {
            await axiosInstance.put(`/pets/bind/${selectedAppointment.pet.id}`);
            alert("Pet successfully bound to the vet!");

            if (createAnamnesis) {
                const anamnesisDTO = {
                    pet: selectedAppointment.pet.id,
                    name: selectedAppointment.pet.name,
                    description: selectedAppointment.description,
                    date: new Date().toISOString(),
                    appointment: selectedAppointment.id,
                };
                await axiosInstance.post("/anamnesis/save", anamnesisDTO);
                alert("Anamnesis successfully created!");
            }

            closeModal();
        } catch (error) {
            console.error("Error binding pet or creating anamnesis:", error);
            alert("Failed to bind pet or create anamnesis.");
        }
    };

    const handleCancel = async () => {
        if (!selectedAppointment) return;

        try {
            await axiosInstance.delete(`/appointments/cancel-appointment/${selectedAppointment.id}`, {
                data: cancelReason,
            });
            alert("Appointment successfully canceled!");
            closeModal();
            setCancelReason("");
            setShowCancelModal(false);
            const updatedAppointments = appointments.filter((app) => app.id !== selectedAppointment.id);
            setAppointments(updatedAppointments);
        } catch (error) {
            console.error("Error canceling appointment:", error);
            alert("Failed to cancel appointment.");
        }
    };

    const openCancelModal = () => {
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancelReason("");
    };

    const handleViewPetProfile = (petId) => {
        navigate(`/pet/${petId}`);
    };

    const closePetProfile = () => {
        setSelectedPetId(null);
    };

    const handleSaveVetProfile = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/users/update-user/`, updatedData);
            setVetInfo(response.data);
            setIsEditModalOpen(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating vet profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const openEditVetModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditVetModal = () => {
        setIsEditModalOpen(false);
    };

    const openRescheduleModal = async () => {
        try {
            const response = await axiosInstance.get("/slots/available-priority-slots");
            setAvailableSlots(response.data);
            setShowRescheduleModal(true);
        } catch (error) {
            console.error("Error fetching available priority slots:", error);
            alert("Failed to fetch available slots. Please try again.");
        }
    };

    const closeRescheduleModal = () => {
        setShowRescheduleModal(false);
        setSelectedSlotId(null);
        setAvailableSlots([]);
    };

    const handleReschedule = async () => {
        if (!selectedSlotId) {
            alert("Please select a new slot.");
            return;
        }

        try {
            await axiosInstance.put(`/appointments/update-appointment/${selectedAppointment.id}`, null, {
                params: { slotId: selectedSlotId },
            });
            alert("Appointment rescheduled successfully!");
            closeRescheduleModal();
            closeModal();
            const updatedAppointments = appointments.map((app) =>
                app.id === selectedAppointment.id ? { ...app, slotId: selectedSlotId } : app
            );
            setAppointments(updatedAppointments);
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            alert("Failed to reschedule appointment.");
        }
    };

    const handleManageQuarantines = () => {
        navigate("/quarantine-management");
    };

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    if (!vetInfo) {
        return <div>No vet information found.</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mt-1" style={{ display: "flex", gap: "200px" }}>
                <div style={{ flex: 0 }}>
                    <div
                        className="container rounded-3 vet-card"
                        style={{
                            maxWidth: "450px",
                            padding: "20px 10px",
                            margin: "0px 20px",
                            backgroundColor: "#fff7f7",
                        }}
                    >
                        <div
                            className="mb-3 ps-2"
                            style={{
                                maxWidth: "400px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "250px",
                            }}
                        >
                            {vetInfo.photoUrl ? (
                                <img
                                    className="avatar"
                                    src={vetInfo.photoUrl}
                                    alt={`${vetInfo.name}'s avatar`}
                                    style={{ width: "250px", height: "250px", borderRadius: "50%" }}
                                />
                            ) : (
                                <div>pic placeholder</div>
                            )}
                        </div>
                        <div style={{ padding: "5px 0 0 7%" }}>
                            <h4>
                                <strong>Dr. {vetInfo.name} {vetInfo.surname}</strong>
                            </h4>
                        </div>
                        <div style={{ padding: "0px 20%" }}>
                            <h5>{vetInfo.qualification || "Not specified"}</h5>
                        </div>
                        <div style={{ padding: "0px 0px" }}>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Email:</strong> {vetInfo.email || "Not specified"}
                            </p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Phone:</strong> {vetInfo.phoneNumber || "Not specified"}
                            </p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Schedule:</strong> {vetInfo.schedule || "Not specified"}
                            </p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Working hours:</strong> {vetInfo.workingHours || "Not specified"}
                            </p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Clinic:</strong> {vetInfo.clinic || "Not specified"}
                            </p>
                        </div>
                        <div style={{ padding: "0px 8%" }}>
                            <button className="button btn-no-border rounded-3" onClick={openEditVetModal}>
                                Edit Profile
                            </button>
                            {userRole === "ROLE_VET" && (
                                <button
                                    className="button btn-no-border rounded-3"
                                    onClick={handleManageQuarantines}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Manage Quarantines
                                </button>
                            )}
                        </div>
                    </div>

                    <div
                        className="vet-appointments bg-treatment container mt-3 rounded-1"
                        style={{ padding: "5px", margin: "0px 20px" }}
                    >
                        <h4 className="table-appointment">Upcoming Appointments</h4>
                        {appointments.length > 0 ? (
                            <table cellPadding="2" cellSpacing="0" className="uniq-table">
                                <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{new Date(appointment.slot.date).toLocaleDateString()}</td>
                                        <td>{appointment.slot.startTime.slice(0, 5)}</td>
                                        <td>{appointment.pet.name}</td>
                                        <td>
                                            <button className="button btn-no-border" onClick={() => handleView(appointment.id)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ paddingLeft: "70px", paddingTop: "10px" }}>No upcoming appointments.</p>
                        )}
                    </div>
                </div>
                {userRole === "ROLE_VET" && (
                    <div className="bg-table element-space wards" style={{ flex: 1 }}>
                        <h2>My Wards</h2>
                        {doctorPets.length > 0 ? (
                            <table cellPadding="0" cellSpacing="0" className="uniq-table">
                                <tbody>
                                {doctorPets.map((pet) => (
                                    <tr key={pet.id}>
                                        <td style={{ padding: "20px" }}>
                                            {pet.photoUrl ? (
                                                <img
                                                    className="avatar"
                                                    src={pet.photoUrl}
                                                    alt={`${pet.name}'s avatar`}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "50%",
                                                        marginRight: "20px",
                                                    }}
                                                />
                                            ) : (
                                                <p>(anonymous)</p>
                                            )}{" "}
                                            {"\t"}
                                            <strong>{pet.name}</strong> {" "} {"\t"}
                                            ({pet.type}, {" "}
                                            {pet.age} y.o. {" "}
                                            {pet.sex})
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                className="button btn-no-border rounded-3"
                                                onClick={() => handleViewPetProfile(pet.id)}
                                            >
                                                View Pet Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No pets assigned to this vet.</p>
                        )}
                    </div>
                )}
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "275px",
                    bottom: "10px",
                    right: "0px",
                    width: "500px",
                    height: "600px",
                    backgroundImage: `url(${VetImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: "0.4",
                }}
            />

            {selectedAppointment && (
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
                    <h3>Appointment Details</h3>
                    <p><strong>Patient:</strong> {selectedAppointment.pet.name}</p>
                    <p><strong>Type:</strong> {selectedAppointment.pet.type}</p>
                    <p><strong>Age:</strong> {selectedAppointment.pet.age}</p>
                    <p><strong>Sex:</strong> {selectedAppointment.pet.sex}</p>
                    <p><strong>Owner:</strong> {selectedAppointment.ownerName}</p>
                    <p><strong>Complaint:</strong> {selectedAppointment.description}</p>
                    <p><strong>Date:</strong> {selectedAppointment.slot.date}</p>
                    <p><strong>Time:</strong> {selectedAppointment.slot.startTime} - {selectedAppointment.slot.endTime}</p>
                    <p><strong>Priority:</strong> {selectedAppointment.priority ? "Yes" : "No"}</p>

                    <div style={{ margin: "20px 0" }}>
                        <h4>Body Marker</h4>
                        {selectedAppointment.pet.type === "DOG" ? (
                            <DogBodyMap initialMarker={bodyMarker} readOnly={true} />
                        ) : selectedAppointment.pet.type === "CAT" ? (
                            <CatBodyMap initialMarker={bodyMarker} readOnly={true} />
                        ) : (
                            <p>Unknown animal type</p>
                        )}
                    </div>

                    <label>
                        <input
                            type="checkbox"
                            checked={createAnamnesis}
                            onChange={(e) => setCreateAnamnesis(e.target.checked)}
                        />
                        Create Anamnesis
                    </label>
                    <button onClick={handleApprove}>Approve</button>
                    {selectedAppointment.priority && <button onClick={openCancelModal}>Cancel</button>}
                    {selectedAppointment.priority && <button onClick={openRescheduleModal}>Reschedule</button>}
                    <button onClick={closeModal}>Close</button>
                </div>
            )}
            {selectedPetId && <PetProfile petId={selectedPetId} onClose={closePetProfile} />}

            {showCancelModal && (
                <div style={modalStyles}>
                    <h3>Cancel Appointment</h3>
                    <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Enter cancellation reason"
                        rows={4}
                        style={{ width: "100%", margin: "10px 0" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleCancel} disabled={!cancelReason}>
                            Confirm Cancel
                        </button>
                        <button onClick={closeCancelModal}>Close</button>
                    </div>
                </div>
            )}

            {showRescheduleModal && (
                <div style={modalStyles}>
                    <h3>Reschedule Appointment</h3>
                    {availableSlots.length > 0 ? (
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {availableSlots.map((slot) => (
                                <div key={slot.id} style={{ marginBottom: "10px" }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="slot"
                                            value={slot.id}
                                            checked={selectedSlotId === slot.id}
                                            onChange={() => setSelectedSlotId(slot.id)}
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
                        <button onClick={handleReschedule} disabled={!selectedSlotId}>
                            Confirm Reschedule
                        </button>
                        <button onClick={closeRescheduleModal}>Cancel</button>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <EditOwnerModal
                    ownerInfo={vetInfo}
                    onClose={closeEditVetModal}
                    onSave={handleSaveVetProfile}
                />
            )}
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
    width: "400px",
    maxWidth: "90%",
};

export default VetDashboard;