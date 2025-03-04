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
        const { name, value } = e.target;

        if (name === "age") {
            if (value === "") {
                setPetData({ ...petData, [name]: "" });
                return;
            }
            const numValue = Number(value);
            if (numValue < 0 || numValue > 40) return;
        }

        if (name === "weight") {
            if (value === "") {
                setPetData({ ...petData, [name]: "" });
                return;
            }
            const numValue = Number(value);
            if (numValue < 0 || numValue > 120) return;
        }

        setPetData({ ...petData, [name]: value });
    };

    const handleKeyDown = (e) => {
        if (e.key === "-") {
            e.preventDefault();
        }
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
                    weight: petData.weight === "" ? null : parseFloat(petData.weight),
                    sex: petData.sex,
                    age: petData.age === "" ? null : parseInt(petData.age)
                }
            );

            onPetCreated(response.data);
        } catch (error) {
            console.error("Error creating pet:", error.response?.data || error.message);
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
                <div className="modal-header">
                    <h3>Create New Pet</h3>
                </div>
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
                            className="form-info"
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
                            className="form-info"
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="number"
                            name="age"
                            value={petData.age}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Age"
                            required
                            min="0"
                            max="40"
                            style={{ width: "100%", padding: "8px" }}
                            className="form-info"
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="number"
                            name="weight"
                            value={petData.weight}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Weight (kg)"
                            required
                            min="0"
                            max="120"
                            style={{ width: "100%", padding: "8px" }}
                            className="form-info"
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label className="modal-label">Animal Type:</label>
                        <select
                            name="type"
                            value={petData.type}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                            className="form-info"
                        >
                            <option value="DOG">Dog</option>
                            <option value="CAT">Cat</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label className="modal-label">Sex:</label>
                        <select
                            name="sex"
                            value={petData.sex}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                            className="form-info"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
                        <button
                            className="form-button"
                            type="submit"
                            style={{ padding: "8px 16px", border: "none", borderRadius: "4px" }}
                        >
                            Create Pet
                        </button>
                        <button
                            className="rounded-2"
                            type="button"
                            onClick={onCancel}
                            style={{ padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #ccc" }}
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