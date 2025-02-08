import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import NewPetForm from "./NewPetForm";
import useAxiosWithAuth from "../AxiosAuth";

const AppointmentPage = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();

    const [showNewPetForm, setShowNewPetForm] = useState(false);
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");

    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState("");

    const [priority, setPriority] = useState(false);

    useEffect(() => {
        if (!token) return;

        axiosInstance.get("/pets/all-pets")
            .then(response => setPets(response.data))

            .catch(error => console.error("Error fetching pets:", error));

        axiosInstance.get("/slots/available-slots")
            .then(response => setSlots(response.data))
            .catch(error => console.error("Error fetching slots:", error));
    }, [token, axiosInstance]);

    const handlePetCreated = (newPet) => {
        setPets([...pets, newPet]);
        setSelectedPetId(newPet.id);
        setShowNewPetForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert("Authorization required!");
            return;
        }

        try {
            await axiosInstance.post("/appointments/new-appointment", {
                priority,
                slotId: parseInt(selectedSlotId),
                petId: parseInt(selectedPetId)
            });

            alert("Appointment successfully booked!");
            navigate("/main-page");
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("Failed to book appointment.");
        }
    };

    if (showNewPetForm) {
        return <NewPetForm token={token} onPetCreated={handlePetCreated} onCancel={() => setShowNewPetForm(false)} />;
    }

    return (
        <div>
            <div>
                <p>Interactive Map Placeholder</p>
            </div>

            <div>
                <h2>Book an Appointment</h2>

                <label>Select a Pet:</label>
                <select value={selectedPetId} onChange={(e) => setSelectedPetId(e.target.value)}>
                    <option value="">Select Pet</option>
                    {pets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                </select>

                <button onClick={() => setShowNewPetForm(true)}>Create New Pet</button>

                <form onSubmit={handleSubmit}>
                    <label>Select a Time Slot:</label>
                    <select value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)}>
                        <option value="">Select Slot</option>
                        {slots.map(slot => (
                            <option key={slot.id} value={slot.id}>
                                {slot.startTime} - {slot.endTime}
                            </option>
                        ))}
                    </select>

                    <label>Priority:</label>
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
