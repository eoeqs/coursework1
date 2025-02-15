import React, { useState } from "react";

const AddHealthUpdateModal = ({ petId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        dynamics: true,
        symptoms: "",
        notes: "",
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
        onSave({ ...formData, pet: petId });
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
            <h3>Add Health Update</h3>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Dynamics:</label>
                    <select
                        name="dynamics"
                        value={formData.dynamics}
                        onChange={(e) => setFormData({ ...formData, dynamics: e.target.value === "true" })}
                    >
                        <option value={true}>Positive</option>
                        <option value={false}>Negative</option>
                    </select>
                </div>
                <div>
                    <label>Symptoms:</label>
                    <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                    />
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default AddHealthUpdateModal;