import React, { useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const EditOwnerModal = ({ ownerInfo, onClose, onSave }) => {
    const axiosInstance = useAxiosWithAuth();
    const [formData, setFormData] = useState({
        name: ownerInfo.name,
        surname: ownerInfo.surname,
        email: ownerInfo.email,
        phoneNumber: ownerInfo.phoneNumber,
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(ownerInfo.photoUrl);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        onSave(formData);

        if (avatarFile) {
            const formData = new FormData();
            formData.append("avatar", avatarFile);

            try {
                await axiosInstance.put("/users/update-avatar", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Avatar updated successfully!");
            } catch (error) {
                console.error("Error updating avatar:", error);
                alert("Failed to update avatar.");
            }
        }
    };

    return (
        <div style={modalStyles}>
            <h3>Edit Profile</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                    <label>Avatar:</label>
                    {avatarPreview && (
                        <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px" }}
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </div>

                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Surname:</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    maxWidth: "400px",
    width: "90%",
};

export default EditOwnerModal;