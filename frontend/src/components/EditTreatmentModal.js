import React, { useState } from "react";

const EditTreatmentModal = ({ treatment, onClose, onSave, diagnosisId, petId }) => {
    const [formData, setFormData] = useState({
        name: treatment ? treatment.name : "",
        description: treatment ? treatment.description : "",
        prescribedMedication: treatment ? treatment.prescribedMedication : "",
        duration: treatment ? treatment.duration : "",
        isCompleted: treatment ? treatment.isCompleted : false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const treatmentData = {
            ...formData,
            diagnosis: diagnosisId,
            pet: petId,
        };

        if (treatment) {
            treatmentData.id = treatment.id;
        }

        onSave(treatmentData);
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
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
            }}>
                <h2>{treatment ? "Edit Treatment" : "Add New Treatment"}</h2>
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
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Prescribed Medication:</label>
                        <input
                            type="text"
                            name="prescribedMedication"
                            value={formData.prescribedMedication}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px" }}
                        />
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
                                Is Completed
                            </label>
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button type="button" onClick={onClose} style={{ padding: "8px 16px" }}>
                            Cancel
                        </button>
                        <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white" }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTreatmentModal;