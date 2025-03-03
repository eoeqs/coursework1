import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const PetSelector = () => {
    const axiosInstance = useAxiosWithAuth();
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedPet, setUpdatedPet] = useState({ name: "", species: "", age: "" });

    useEffect(() => {

        axiosInstance.get("/pets/all-pets")
            .then(response => setPets(response.data))
            .catch(error => console.error("Error fetching pets:", error));
    }, []);

    const handleSelectPet = (petId) => {
        axiosInstance.get(`/pets/pet/${petId}`)
            .then(response => {
                setSelectedPet(response.data);
                setUpdatedPet(response.data);
                setEditMode(false);
            })
            .catch(error => console.error("Error fetching pet details:", error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPet({ ...updatedPet, [name]: value });
    };

    const handleUpdatePet = () => {
        axiosInstance.put(`/pets/update-pet/${selectedPet.id}`, updatedPet)
            .then(response => {
                setSelectedPet(response.data);
                setEditMode(false);
            })
            .catch(error => console.error("Error updating pet:", error));
    };

    return (
        <div>
            <h2>Select a Pet</h2>
            <select onChange={(e) => handleSelectPet(e.target.value)}>
                <option value="">Select Pet</option>
                {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
            </select>

            {selectedPet && (
                <div>
                    <h3>Pet Information</h3>
                    {!editMode ? (
                        <div>
                            <p><strong>Name:</strong> {selectedPet.name}</p>
                            <p><strong>Species:</strong> {selectedPet.species}</p>
                            <p><strong>Age:</strong> {selectedPet.age}</p>
                            <button onClick={() => setEditMode(true)}>Edit Pet</button>
                        </div>
                    ) : (
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={updatedPet.name} onChange={handleInputChange} />

                            <label>Species:</label>
                            <input type="text" name="species" value={updatedPet.species} onChange={handleInputChange} />

                            <label>Age:</label>
                            <input type="number" name="age" value={updatedPet.age} onChange={handleInputChange} />

                            <button onClick={handleUpdatePet}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PetSelector;
