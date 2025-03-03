import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import NewPetForm from "./NewPetForm";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";

const AppointmentPage = ({ onClose }) => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();

    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showNewPetForm, setShowNewPetForm] = useState(false);
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [petInfo, setPetInfo] = useState(null);
    const [complaintDescription, setComplaintDescription] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const [priority, setPriority] = useState(false);
    const [bodyMarker, setBodyMarker] = useState(null);

    useEffect(() => {
        if (!token) return;

        axiosInstance
            .get("/users/current-user-info")
            .then((response) => {
                const fetchedUserId = response.data.id;
                const fetchedUserRole = response.data.role;
                setUserId(fetchedUserId);
                setUserRole(fetchedUserRole);

                return axiosInstance.get(`/users/user-info/${fetchedUserId}`);
            })
            .then((response) => {
                setOwnerName(response.data.name);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
            });
    }, [token, axiosInstance]);

    useEffect(() => {
        if (!token || !userId || !userRole) return;

        if (userRole === "ROLE_OWNER") {
            axiosInstance
                .get("/pets/user-pets")
                .then((response) => setPets(response.data))
                .catch((error) => console.error("Error fetching user pets:", error));
        } else if (userRole === "ROLE_VET") {
            axiosInstance
                .get(`/pets/doctor-pets/${userId}`)
                .then((response) => setPets(response.data))
                .catch((error) => console.error("Error fetching doctor pets:", error));
        }
    }, [token, userId, userRole, axiosInstance]);

    useEffect(() => {
        if (!token) return;

        const fetchSlotsWithVetInfo = async () => {
            try {
                const slotsResponse = await axiosInstance.get("/slots/available-slots");
                const slotsData = slotsResponse.data;

                const vetIds = [...new Set(slotsData.map((slot) => slot.vetId))];
                const vetPromises = vetIds.map((vetId) =>
                    axiosInstance.get(`/users/user-info/${vetId}`)
                );
                const vetResponses = await Promise.all(vetPromises);

                const vetMap = vetResponses.reduce((acc, response) => {
                    const vet = response.data;
                    acc[vet.id] = `${vet.name} ${vet.surname}`;
                    return acc;
                }, {});

                const updatedSlots = slotsData.map((slot) => ({
                    ...slot,
                    vetName: vetMap[slot.vetId] || "Unknown Vet",
                }));

                setSlots(updatedSlots);
            } catch (error) {
                console.error("Error fetching slots or vet info:", error);
            }
        };

        fetchSlotsWithVetInfo();
    }, [token, axiosInstance]);

    useEffect(() => {
        if (!selectedPetId) return;

        axiosInstance
            .get(`/pets/pet/${selectedPetId}`)
            .then((response) => setPetInfo(response.data))
            .catch((error) => {
                console.error("Error fetching pet info:", error);
                setPetInfo(null);
            });
    }, [selectedPetId, axiosInstance]);

    const handlePetCreated = (newPet) => {
        setPets([...pets, newPet]);
        setSelectedPetId(newPet.id);
        setShowNewPetForm(false);
    };

    const handleBodyMark = (marker) => {
        setBodyMarker(marker);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            return;
        }

        try {
            const appointmentResponse = await axiosInstance.post("/appointments/new-appointment", {
                priority,
                slotId: parseInt(selectedSlotId),
                petId: parseInt(selectedPetId),
                description: complaintDescription,
            });
            if (bodyMarker) {
                await axiosInstance.post("/body-marker/save", {
                    positionX: bodyMarker.x,
                    positionY: bodyMarker.y,
                    bodyPart: bodyMarker.part,
                    pet: selectedPetId,
                    appointment: appointmentResponse.data.id,
                });
            }
            onClose();
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    return (
        <div>
            {showNewPetForm && (
                <NewPetForm
                    token={token}
                    onPetCreated={handlePetCreated}
                    onCancel={() => setShowNewPetForm(false)}
                />
            )}

            <div>
                <h3>Owner: {ownerName || "Loading..."}</h3>
            </div>

            <div>
                <h2>Book an Appointment</h2>

                <label>Select a Pet:</label>
                <select value={selectedPetId} onChange={(e) => setSelectedPetId(e.target.value)}>
                    <option value="">Select Pet</option>
                    {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            {pet.name}
                        </option>
                    ))}
                </select>

                {(userRole === "ROLE_OWNER" || userRole === "ROLE_USER") && (
                    <button onClick={() => setShowNewPetForm(true)}>Create New Pet</button>
                )}

                {selectedPetId && petInfo && (
                    <div>
                        <h3>Pet Info:</h3>
                        <p>
                            <strong>Name:</strong> {petInfo.name}
                        </p>
                        <p>
                            <strong>Breed:</strong> {petInfo.breed}
                        </p>
                        <p>
                            <strong>Type:</strong> {petInfo.type}
                        </p>
                        <p>
                            <strong>Weight:</strong> {petInfo.weight} kg
                        </p>
                        <p>
                            <strong>Sex:</strong> {petInfo.sex}
                        </p>
                        <p>
                            <strong>Age:</strong> {petInfo.age} years
                        </p>
                    </div>
                )}

                {selectedPetId && petInfo && (
                    <div>
                        <p>Mark the problem area:</p>
                        {petInfo.type === "DOG" && <DogBodyMap onMark={handleBodyMark} />}
                        {petInfo.type === "CAT" && <CatBodyMap onMark={handleBodyMark} />}
                    </div>
                )}

                <div>
                    <label>Complaints and Symptoms:</label>
                    <textarea
                        value={complaintDescription}
                        onChange={(e) => setComplaintDescription(e.target.value)}
                        placeholder="Describe the symptoms or complaint here..."
                        rows="4"
                        cols="50"
                    />
                </div>
                <div>
                    <h2>Available Time Slots</h2>

                    <table border="1">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time Slot</th>
                            <th>Doctor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {slots.map((slot) => (
                            <tr
                                key={slot.id}
                                onClick={() => setSelectedSlotId(slot.id)}
                                style={{
                                    backgroundColor: selectedSlotId === slot.id ? "#D3E4CD" : "white",
                                    cursor: "pointer",
                                }}
                            >
                                <td>{slot.date}</td>
                                <td>
                                    {slot.startTime} - {slot.endTime}
                                </td>
                                <td>{slot.vetName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {selectedSlotId && (
                        <div>
                            <h3>Slot Information:</h3>
                            <p>
                                <strong>Date:</strong> {slots.find((slot) => slot.id === selectedSlotId)?.date}
                            </p>
                            <p>
                                <strong>Time:</strong> {slots.find((slot) => slot.id === selectedSlotId)?.startTime} -{" "}
                                {slots.find((slot) => slot.id === selectedSlotId)?.endTime}
                            </p>
                            <p>
                                <strong>Doctor:</strong> {slots.find((slot) => slot.id === selectedSlotId)?.vetName}
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <label>It is an emergency:</label>
                    <input type="checkbox" checked={priority} onChange={() => setPriority(!priority)} />

                    <button type="submit" disabled={!selectedPetId || !selectedSlotId}>
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentPage;