import React, { useState } from "react";

const CreateSectorModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        capacity: 1,
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (name === "capacity") {
            const capacityValue = parseInt(value, 10);
            if (capacityValue < 1) {
                setError("Capacity cannot be less than 1.");
                return;
            } else {
                setError("");
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.capacity < 1) {
            setError("Capacity cannot be less than 1.");
            return;
        }
        if (formData.capacity > 100) {
            setError("Capacity cannot be more than 100.");
            return;
        }

        setError("");

        onSave(formData);
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header"><h3>Create Sector</h3></div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <label className="modal-label">
                        Category:
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="modal-input-group"
                        >
                            <option value="">Select a category</option>
                            <option value="CONTAGIOUS">Contagious</option>
                            <option value="DANGEROUS">Dangerous</option>
                        </select>
                    </label>
                    <label className="modal-label">
                        Capacity:
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            placeholder="Enter capacity"
                            min="1"
                            className="modal-input-group"
                        />
                        {error && <p style={{ color: "red", margin: "5px 0 0", fontSize: "14px" }}>{error}</p>}
                    </label>
                    <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "5px"}}>
                        <button className="form-button" type="submit" style={{padding: "5px 35px", color: "white"}}>
                            Save
                        </button>
                        <button className="rounded-2" type="button" onClick={onClose}
                                style={{
                                    padding: "5px 26px",
                                    backgroundColor: "#ffffff",
                                    border: "1",
                                    borderColor: "#c1c0c0"
                                }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalOverlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalStyles = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
};

export default CreateSectorModal;