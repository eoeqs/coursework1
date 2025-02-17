import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import PetProfile from "./PetProfile";
import { useNavigate } from "react-router-dom";

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

                if (fetchedUserRole === "VET") {
                    const doctorPetsResponse = await axiosInstance.get(`/pets/doctor-pets/${vetInfoResponse.data.id}`);
                    setDoctorPets(doctorPetsResponse.data);
                }

                const appointmentsResponse = await axiosInstance.get(`/appointments/upcoming-vet/${vetInfoResponse.data.id}`);
                const appointmentPromises = appointmentsResponse.data.map(async (appointment) => {
                    const [slotResponse, petResponse] = await Promise.all([
                        axiosInstance.get(`/slots/${appointment.slotId}`),
                        axiosInstance.get(`/pets/pet/${appointment.petId}`)
                    ]);
                    return {
                        ...appointment,
                        slot: slotResponse.data,
                        pet: petResponse.data
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
            const appointment = appointments.find(app => app.id === appointmentId);
            if (!appointment) {
                throw new Error("Appointment not found");
            }

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
                ownerName: ownerName
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
            // Привязка питомца к ветеринару
            await axiosInstance.put(`/pets/bind/${selectedAppointment.pet.id}`);
            alert("Pet successfully bound to the vet!");

            // Создание анамнеза, если выбрана опция
            if (createAnamnesis) {
                const anamnesisDTO = {
                    pet: selectedAppointment.pet.id,
                    name: selectedAppointment.pet.name,
                    description: selectedAppointment.description,
                    date: new Date().toISOString(),
                    appointment: selectedAppointment.id // Передаем appointmentId
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
            await axiosInstance.delete(`/appointments/cancel-appointment/${selectedAppointment.id}`);
            alert("Appointment successfully canceled!");
            closeModal();
        } catch (error) {
            console.error("Error canceling appointment:", error);
            alert("Failed to cancel appointment.");
        }
    };

    const handleViewPetProfile = (petId) => {
        navigate(`/pet/${petId}`);
    };

    const closePetProfile = () => {
        setSelectedPetId(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!vetInfo) {
        return <div>No vet information found.</div>;
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <div>
                        Vet profile pic placeholder
                    </div>
                    <div>
                        <h2>{vetInfo.name} {vetInfo.surname}</h2>
                        <p><strong>Qualification:</strong> {vetInfo.qualification || "Not specified"}</p>
                        <p><strong>Email:</strong> {vetInfo.email || "Not specified"}</p>
                        <p><strong>Phone:</strong> {vetInfo.phoneNumber || "Not specified"}</p>
                        <p><strong>Working hours:</strong> {vetInfo.workingHours || "Not specified"}</p>
                    </div>
                </div>

                {userRole === "VET" && (
                    <div style={{ flex: 1, marginLeft: "20px" }}>
                        <h2>My Pets</h2>
                        {doctorPets.length > 0 ? (
                            <table border="1" cellPadding="10" cellSpacing="0">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Sex</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {doctorPets.map((pet) => (
                                    <tr key={pet.id}>
                                        <td>{pet.name}</td>
                                        <td>{pet.age}</td>
                                        <td>{pet.sex}</td>
                                        <td>
                                            <button onClick={() => handleViewPetProfile(pet.id)}>
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

            <div>
                <h2>Upcoming Appointments</h2>
                {appointments.length > 0 ? (
                    <table border="1" cellPadding="10" cellSpacing="0">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Pet Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.slot.date}</td>
                                <td>{appointment.slot.startTime} - {appointment.slot.endTime}</td>
                                <td>{appointment.pet.name}</td>
                                <td>
                                    <button onClick={() => handleView(appointment.id)}>View</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming appointments.</p>
                )}
            </div>

            {selectedAppointment && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000
                }}>
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
                    <label>
                        <input
                            type="checkbox"
                            checked={createAnamnesis}
                            onChange={(e) => setCreateAnamnesis(e.target.checked)}
                        />
                        Create Anamnesis
                    </label>
                    <button onClick={handleApprove}>Approve</button>
                    {selectedAppointment.priority && (
                        <button onClick={handleCancel}>Cancel</button>
                    )}
                    <button onClick={closeModal}>Close</button>
                </div>
            )}
            {selectedPetId && (
                <PetProfile petId={selectedPetId} onClose={closePetProfile} />
            )}
        </div>
    );
};

export default VetDashboard;