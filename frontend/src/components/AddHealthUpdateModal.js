import React, { useState } from "react";

const AddHealthUpdateModal = ({ petId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        dynamics: true,
        symptoms: "",
        notes: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "dynamics" ? value === "true" : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.dynamics === undefined || formData.dynamics === null) {
            setErrorMessage("Dynamics is required. Please select Positive or Negative.");
            return;
        }
        if (formData.symptoms.length > 1000) {
            setErrorMessage("Symptoms must not exceed 1000 characters.");
            return;
        }
        if (formData.notes.length > 1000) {
            setErrorMessage("Notes must not exceed 1000 characters.");
            return;
        }

        setErrorMessage("");

        try {
            const healthUpdateData = {
                dynamics: formData.dynamics,
                symptoms: formData.symptoms.trim(),
                notes: formData.notes.trim(),
                pet: petId,
            };
            await onSave(healthUpdateData);
            setSuccessMessage("Health update added successfully.");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error saving health update:", error);
            setErrorMessage("Failed to add health update. Please try again.");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
            }}
        >
            <h3>Add Health Update</h3>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Dynamics:</label>
                    <select
                        name="dynamics"
                        value={formData.dynamics.toString()}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                        required
                    >
                        <option value="true">Positive</option>
                        <option value="false">Negative</option>
                    </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Symptoms:</label>
                    <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                        maxLength={1000}
                        placeholder="Enter symptoms (optional, max 1000 characters)"
                    />
                    <small>{formData.symptoms.length}/1000 characters</small>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                        maxLength={1000}
                        placeholder="Enter notes (optional, max 1000 characters)"
                    />
                    <small>{formData.notes.length}/1000 characters</small>
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

export default AddHealthUpdateModal;