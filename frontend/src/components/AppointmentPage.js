import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthProvider";
import NewPetForm from "./NewPetForm";

const AppointmentPage = () => {
    const { token: authToken } = useAuth();
    const [token, setToken] = useState(localStorage.getItem("token") || authToken);
    const [showNewPetForm, setShowNewPetForm] = useState(false);

    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [priority, setPriority] = useState(false);

    useEffect(() => {
        if (authToken) {
            setToken(authToken);
            localStorage.setItem("token", authToken);
        }
    }, [authToken]);

    useEffect(() => {
        if (!token) return;

        axios.get("http://localhost:8080/api/pets", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setPets(response.data))
            .catch(error => console.error("Error fetching pets:", error));
    }, [token]);

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
            await axios.post(
                "http://localhost:8080/api/appointments/new-appointment",
                {
                    priority,
                    slotId: parseInt(selectedSlot),
                    petId: parseInt(selectedPetId)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

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
                    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                        <option value="">Select Slot</option>
                        <option value="1">10:00 - 12:00</option>
                        <option value="2">12:00 - 14:00</option>
                        <option value="3">14:00 - 16:00</option>
                    </select>

                    <label>Priority:</label>
                    <input type="checkbox" checked={priority} onChange={() => setPriority(!priority)} />

                    <button type="submit" disabled={!selectedPetId}>
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentPage;
