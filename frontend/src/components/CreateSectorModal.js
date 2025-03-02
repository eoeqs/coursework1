import React, { useState } from "react";

const CreateSectorModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        capacity: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "capacity" ? parseInt(value) || "" : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.category || !formData.capacity) {
            alert("Please provide all required fields.");
            return;
        }
        console.log("Sending sector data:", formData);
        onSave(formData);
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <h3>Create Sector</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter sector name"
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Category:
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        >
                            <option value="">Select a category</option>
                            <option value="CONTAGIOUS">Contagious</option>
                            <option value="DANGEROUS">Dangerous</option>
                        </select>
                    </label>
                    <label>
                        Capacity:
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            placeholder="Enter capacity"
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>
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