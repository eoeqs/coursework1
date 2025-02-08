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
        setPetData({ ...petData, [e.target.name] : e.target.value });
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
        <div>
            <h2>Create New Pet</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={petData.name} onChange={handleChange} placeholder="Name" required />
                <input type="text" name="breed" value={petData.breed} onChange={handleChange} placeholder="Breed" required />
                <input type="number" name="age" value={petData.age} onChange={handleChange} placeholder="Age" required />
                <input type="number" name="weight" value={petData.weight} onChange={handleChange} placeholder="Weight (kg)" required />

                <label>Animal Type:</label>
                <select name="type" value={petData.type} onChange={handleChange}>
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                </select>

                <label>Sex:</label>
                <select name="sex" value={petData.sex} onChange={handleChange}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <button type="submit">Create Pet</button>
                <button type="button" onClick={onCancel}>Back</button>
            </form>
        </div>
    );
};

export default NewPetForm;
