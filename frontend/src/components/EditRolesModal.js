import React, { useState } from "react";

const EditRolesModal = ({ user, onClose, onSave }) => {
    const [selectedRole, setSelectedRole] = useState("");

    const roles = ["ROLE_USER", "ROLE_OWNER", "ROLE_VET", "ROLE_ADMIN"];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRole) {
            alert("Please select a role.");
            return;
        }
        onSave(selectedRole);
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <h3>Edit Roles for {user.username}</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Select Role:
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            style={{ width: "100%", marginTop: "5px" }}
                        >
                            <option value="">Select a role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
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

export default EditRolesModal;