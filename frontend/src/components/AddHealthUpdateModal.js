import React, { useState } from "react";
import '../pinkmodal.css';

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
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        <div className="pink-modal-overlay" onClick={onClose}>
            <div className="pink-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="pink-modal-header">
                    <h3 className="pink-modal-header-title">Add Health Update</h3>
                </div>
                <form onSubmit={handleSubmit} className="pink-modal-form">
                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Dynamics:</label>
                        <select
                            name="dynamics"
                            value={formData.dynamics}
                            onChange={(e) => setFormData({ ...formData, dynamics: e.target.value === "true" })}
                            className="pink-modal-select"
                        >
                            <option value={true}>Positive</option>
                            <option value={false}>Negative</option>
                        </select>
                    </div>
                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Symptoms:</label>
                        <textarea
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            className="pink-modal-textarea"
                            placeholder="Enter symptoms"
                        />
                    </div>
                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Notes:</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="pink-modal-textarea"
                            placeholder="Enter additional notes"
                        />
                    </div>
                    <div className="pink-modal-footer">
                        <button type="submit" className="pink-modal-action-button">Save</button>
                        <button type="button" onClick={onClose} className="pink-modal-cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHealthUpdateModal;