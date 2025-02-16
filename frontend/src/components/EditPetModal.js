import React, { useState } from "react";

const EditPetModal = ({ petInfo, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: petInfo.name || "",
        type: petInfo.type || "CAT",
        age: petInfo.age || "",
        sex: petInfo.sex || "MALE",
        weight: petInfo.weight || "",
        breed: petInfo.breed || "",
        sector: petInfo.sector || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
        }}>
            <h3>Edit Pet Profile</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="CAT">Cat</option>
                        <option value="DOG">Dog</option>
                    </select>
                </div>
                <div>
                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Sex:</label>
                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <div>
                    <label>Weight (kg):</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Breed:</label>
                    <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Sector:</label>
                    <input
                        type="text"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default EditPetModal;