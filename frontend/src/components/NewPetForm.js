import React, { useState } from "react";
import useAxiosWithAuth from '../AxiosAuth';

const NewPetForm = ({ onPetCreated, onCancel }) => {
    const [petData, setPetData] = useState({
        name: "",
        breed: "",
        type: "DOG",
        weight: "",
        sex: "MALE",
        age: ""
    });

    const axiosWithAuth = useAxiosWithAuth();

    const handleChange = (e) => {
        setPetData({ ...petData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosWithAuth.post(
                "/pets/new-pet",
                {
                    name: petData.name,
                    breed: petData.breed,
                    type: petData.type,
                    weight: parseFloat(petData.weight),
                    sex: petData.sex,
                    age: parseInt(petData.age)
                }
            );

            alert("Pet successfully created!");
            onPetCreated(response.data);
        } catch (error) {
            console.error("Error creating pet:", error.response?.data || error.message);
            alert("Failed to create pet.");
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}>
                <h2>Create New Pet</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            name="name"
                            value={petData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            name="breed"
                            value={petData.breed}
                            onChange={handleChange}
                            placeholder="Breed"
                            required
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="number"
                            name="age"
                            value={petData.age}
                            onChange={handleChange}
                            placeholder="Age"
                            required
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="number"
                            name="weight"
                            value={petData.weight}
                            onChange={handleChange}
                            placeholder="Weight (kg)"
                            required
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Animal Type:</label>
                        <select
                            name="type"
                            value={petData.type}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                        >
                            <option value="DOG">Dog</option>
                            <option value="CAT">Cat</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Sex:</label>
                        <select
                            name="sex"
                            value={petData.sex}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                            type="submit"
                            style={{ padding: "8px 16px", border: "none", borderRadius: "4px" }}
                        >
                            Create Pet
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ padding: "8px 16px", border: "none", borderRadius: "4px" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPetForm;