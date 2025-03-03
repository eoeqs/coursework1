import React, { useState } from "react";

const CreateClinicModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        address: "",
        workingHours: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.address || !formData.workingHours) {
            alert("Please provide both address and working hours.");
            return;
        }
        onSave(formData);
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header"><h3>Create Clinic</h3></div>
                <form onSubmit={handleSubmit}>
                    <label className="modal-label">
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter clinic address"
                            style={{ width: "100%", marginTop: "5px" }}
                            className="modal-input-group"
                        />
                    </label>
                    <label className="modal-label">
                        Working Hours:
                        <input
                            type="text"
                            name="workingHours"
                            value={formData.workingHours}
                            onChange={handleChange}
                            placeholder="Enter working hours (e.g., 9:00-17:00)"
                            style={{ width: "100%", marginTop: "5px" }}
                            className="modal-input-group"
                        />
                    </label>
                    <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "5px"}}>
                        <button className="form-button" type="submit" style={{padding: "3px 35px", color: "white"}}>
                            Save
                        </button>
                        <button className="rounded-2" type="button" onClick={onClose}
                                style={{
                                    padding: "3px 26px",
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

export default CreateClinicModal;