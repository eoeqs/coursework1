import React, { useState } from "react";

const EditTreatmentModal = ({ treatment, onClose, onSave, diagnosisId, petId }) => {
    const [formData, setFormData] = useState({
        name: treatment ? treatment.name : "",
        description: treatment ? treatment.description : "",
        prescribedMedication: treatment ? treatment.prescribedMedication : "",
        duration: treatment ? treatment.duration : "",
        isCompleted: treatment ? treatment.isCompleted : false,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setErrorMessage("Name is required.");
            return;
        }
        if (formData.name.length > 255) {
            setErrorMessage("Name must not exceed 255 characters.");
            return;
        }
        if (formData.description.length > 1000) {
            setErrorMessage("Description must not exceed 1000 characters.");
            return;
        }
        if (formData.prescribedMedication.length > 1000) {
            setErrorMessage("Prescribed Medication must not exceed 1000 characters.");
            return;
        }
        if (formData.duration.length > 255) {
            setErrorMessage("Duration must not exceed 255 characters.");
            return;
        }

        setErrorMessage("");

        try {
            const treatmentData = {
                ...formData,
                name: formData.name.trim(),
                description: formData.description.trim(),
                prescribedMedication: formData.prescribedMedication.trim(),
                duration: formData.duration.trim(),
                diagnosis: diagnosisId,
                pet: petId,
            };

            if (treatment) {
                treatmentData.id = treatment.id;
            }

            onSave(treatmentData);
            setSuccessMessage(treatment ? "Treatment updated successfully." : "Treatment added successfully.");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error saving treatment:", error);
            setErrorMessage("Failed to save treatment. Please try again.");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "400px",
                }}
            >
                <div className="modal-header">
                    <h3>{treatment ? "Edit Treatment" : "Add New Treatment"}</h3>
                </div>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px" }}
                            maxLength={255}
                            placeholder="Enter treatment name"
                            className="form-info"
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                            maxLength={1000}
                            placeholder="Enter description (optional, max 1000 characters)"
                            className="form-info"
                        />
                        <small>{formData.description.length}/1000 characters</small>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Prescribed Medication:</label>
                        <input
                            type="text"
                            name="prescribedMedication"
                            value={formData.prescribedMedication}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                            maxLength={1000}
                            placeholder="Enter medication (optional, max 1000 characters)"
                            className="form-info"
                        />
                        <small>{formData.prescribedMedication.length}/1000 characters</small>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                            maxLength={255}
                            placeholder="e.g., 2 weeks (optional, max 255 characters)"
                            className="form-info"
                        />
                        <small>{formData.duration.length}/255 characters</small>
                    </div>

                    {treatment && (
                        <div style={{ marginBottom: "10px" }}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="isCompleted"
                                    checked={formData.isCompleted}
                                    onChange={handleChange}
                                />
                                <span> </span>
                                Is Completed
                            </label>
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
                        <button
                            className="form-button"
                            type="submit"
                            style={{ padding: "8px 20px", color: "white" }}
                        >
                            Save
                        </button>
                        <button
                            className="rounded-2"
                            type="button"
                            onClick={onClose}
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

export default EditTreatmentModal;