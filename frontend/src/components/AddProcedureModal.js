import React, { useState } from "react";

const AddProcedureModal = ({ onClose, onSave, petId, anamnesisId, vetId }) => {
    const [procedureData, setProcedureData] = useState({
        type: "",
        name: "",
        date: "",
        description: "",
        notes: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

        // Validation
        if (!procedureData.type) {
            setErrorMessage("Procedure type is required.");
            return;
        }
        if (!procedureTypes.some((type) => type.value === procedureData.type)) {
            setErrorMessage("Invalid procedure type selected.");
            return;
        }
        if (!procedureData.name.trim()) {
            setErrorMessage("Name is required.");
            return;
        }
        if (procedureData.name.length > 255) {
            setErrorMessage("Name must not exceed 255 characters.");
            return;
        }
        if (!procedureData.date) {
            setErrorMessage("Date is required.");
            return;
        }
        if (procedureData.description.length > 2000) {
            setErrorMessage("Description must not exceed 2000 characters.");
            return;
        }
        if (procedureData.notes.length > 2000) {
            setErrorMessage("Notes must not exceed 2000 characters.");
            return;
        }

        setErrorMessage("");

        try {
            const data = {
                ...procedureData,
                name: procedureData.name.trim(),
                description: procedureData.description.trim(),
                notes: procedureData.notes.trim(),
                pet: petId,
                vet: vetId,
                anamnesis: anamnesisId,
            };
            await onSave(data);
            setSuccessMessage("Procedure added successfully.");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error saving procedure:", error);
            setErrorMessage("Failed to add procedure. Please try again.");
        }
    };

    return (
        <div style={modalStyles}>
            <h3>Add New Procedure</h3>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Type:</label>
                    <select
                        name="type"
                        value={procedureData.type}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                        required
                    >
                        <option value="" disabled>
                            Select a type
                        </option>
                        {procedureTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={procedureData.name}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                        maxLength={255}
                        placeholder="Enter procedure name"
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Date:</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={procedureData.date}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={procedureData.description}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                        maxLength={2000}
                        placeholder="Enter description (max 2000 characters)"
                    />
                    <small>{procedureData.description.length}/2000 characters</small>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={procedureData.notes}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                        maxLength={2000}
                        placeholder="Enter notes (optional, max 2000 characters)"
                    />
                    <small>{procedureData.notes.length}/2000 characters</small>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
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