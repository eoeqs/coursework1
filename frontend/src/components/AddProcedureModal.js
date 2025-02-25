import React, { useState } from "react";

const AddProcedureModal = ({ onClose, onSave, petId, anamnesisId, vetId }) => {
    const [procedureData, setProcedureData] = useState({
        type: "",
        name: "",
        date: "",
        description: "",
        notes: "",
    });

    const procedureTypes = [
        { value: "DIAGNOSIS", label: "Diagnosis" },
        { value: "TREATMENT", label: "Treatment" },
        { value: "EXAMINATION", label: "Examination" },
        { value: "PROCEDURE", label: "Procedure" },
        { value: "SURGERY", label: "Surgery" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProcedureData({ ...procedureData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...procedureData,
            pet: petId,
            vet: vetId,
            anamnesis: anamnesisId,
        };
        onSave(data);
    };

    return (
        <div style={modalStyles}>
            <h3>Add New Procedure</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Type:</label>
                    <select
                        name="type"
                        value={procedureData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a type</option>
                        {procedureTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={procedureData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Date:</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={procedureData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={procedureData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={procedureData.notes}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    maxWidth: "500px",
    width: "90%",
};

export default AddProcedureModal;