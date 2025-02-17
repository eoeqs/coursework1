import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../AuthProvider";
import NewPetForm from "./NewPetForm";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";

const AppointmentPage = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [showNewPetForm, setShowNewPetForm] = useState(false);
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [petInfo, setPetInfo] = useState(null);
    const [complaintDescription, setComplaintDescription] = useState("");

    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const [priority, setPriority] = useState(false);
    const [bodyMarker, setBodyMarker] = useState(null);

    useEffect(() => {
        if (!token) return;

        axiosInstance.get("/users/current-user-info")
            .then(response => {
                const fetchedUserId = response.data.id;
                setUserId(fetchedUserId);

                return axiosInstance.get(`/users/user-info/${fetchedUserId}`);
            })
            .then(response => {
                setOwnerName(response.data.name);
            })
            .catch(error => {
                console.error("Error fetching user info:", error);
            });
    }, [token, axiosInstance]);

    useEffect(() => {
        if (!token) return;

        axiosInstance.get("/pets/all-pets")
            .then(response => setPets(response.data))

            .catch(error => console.error("Error fetching pets:", error));

        axiosInstance.get("/slots/available-slots")
            .then(response => setSlots(response.data))
            .catch(error => console.error("Error fetching slots:", error));
    }, [token, axiosInstance]);

    useEffect(() => {
        if (!selectedPetId) return;

        axiosInstance.get(`/pets/pet/${selectedPetId}`)
            .then(response => setPetInfo(response.data))
            .catch(error => {
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
            alert("Authorization required!");
            return;
        }

        try {
            const appointmentResponse = await axiosInstance.post("/appointments/new-appointment", {
                priority,
                slotId: parseInt(selectedSlotId),
                petId: parseInt(selectedPetId),
                description: complaintDescription
            });
            if (bodyMarker) {
                await axiosInstance.post("/body-marker/save", {
                    positionX: bodyMarker.x,
                    positionY: bodyMarker.y,
                    bodyPart: bodyMarker.part,
                    pet: selectedPetId,
                    appointment: appointmentResponse.data.id
                });
            }
            alert("Appointment successfully booked!");
            navigate("/");
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("Failed to book appointment.");
        }
    };

    if (showNewPetForm) {
        return <NewPetForm token={token} onPetCreated={handlePetCreated} onCancel={() => setShowNewPetForm(false)}/>;
    }

    return (
        <div>
            <div>
                <h3>Owner: {ownerName || "Loading..."}</h3></div>
            <div>
                <label>Select Animal:</label>
                <select value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)}>
                    <option value="">Select Animal Type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                </select>
            </div>

            <div>
                <p>Interactive Map:</p>
                {selectedAnimal === "" && (
                    <p>Please select an animal type to display the interactive map.</p>
                )}
                {selectedAnimal === "dog" && <DogBodyMap onMark={handleBodyMark} />}
                {selectedAnimal === "cat" && <CatBodyMap onMark={handleBodyMark} />}
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

                <button onClick={() => setShowNewPetForm(true)}>Create New Pet</button>

                {selectedPetId && petInfo && (
                    <div>
                        <h3>Pet Info:</h3>
                        <p><strong>Name:</strong> {petInfo.name}</p>
                        <p><strong>Breed:</strong> {petInfo.breed}</p>
                        <p><strong>Type:</strong> {petInfo.type}</p>
                        <p><strong>Weight:</strong> {petInfo.weight} kg</p>
                        <p><strong>Sex:</strong> {petInfo.sex}</p>
                        <p><strong>Age:</strong> {petInfo.age} years</p>
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
                                    backgroundColor: selectedSlotId === slot.id ? '#D3E4CD' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <td>{slot.date}</td>
                                <td>{slot.startTime} - {slot.endTime}</td>
                                <td>{slot.vetId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {selectedSlotId && (
                        <div>
                            <h3>Slot Information:</h3>
                            <p><strong>Date:</strong> {slots.find(slot => slot.id === selectedSlotId)?.date}</p>
                            <p><strong>Time:</strong> {slots.find(slot => slot.id === selectedSlotId)?.startTime} - {slots.find(slot => slot.id === selectedSlotId)?.endTime}</p>
                            <p><strong>Doctor:</strong> {slots.find(slot => slot.id === selectedSlotId)?.vetId}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>


                    <label>It is an emergency:</label>
                    <input type="checkbox" checked={priority} onChange={() => setPriority(!priority)}/>

                    <button type="submit" disabled={!selectedPetId || !selectedSlotId}>
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentPage;
