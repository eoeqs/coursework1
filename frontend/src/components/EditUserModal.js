import React, { useState } from "react";

const EditUserModal = ({ user, clinics, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        name: user.name || "",
        surname: user.surname || "",
        clinic: user.clinic || "",
        schedule: user.schedule || "",
        qualification: user.qualification || "",
        workingHours: user.workingHours || "",
        photoUrl: user.photoUrl || "",
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
        onSave(formData);
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <h3>Edit User</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Surname:
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
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

export default EditUserModal;