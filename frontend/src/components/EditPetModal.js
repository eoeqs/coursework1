import React, { useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const EditPetModal = ({ petInfo, onClose, onSave }) => {
    const axiosInstance = useAxiosWithAuth();
    const [formData, setFormData] = useState({
        name: petInfo.name || "",
        type: petInfo.type || "CAT",
        age: petInfo.age || "",
        sex: petInfo.sex || "MALE",
        weight: petInfo.weight || "",
        breed: petInfo.breed || "",
        sector: petInfo.sector || "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(petInfo.photoUrl);

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
                await axiosInstance.put(`/pets/update-avatar/${petInfo.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Pet avatar updated successfully!");
            } catch (error) {
                console.error("Error updating pet avatar:", error);
                alert("Failed to update pet avatar.");
            }
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "30px 40px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            width: "400px",
            maxWidth: "90%",
            fontFamily: "'Arial', sans-serif",
            color: "#333"
        }}>
            <div className="modal-header">
            <h3 style={{textAlign: "center"}}>Edit Pet
                Profile</h3></div>
            <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
                <div style={{marginBottom: "20px"}}>
                    {avatarPreview && (
                        <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px", marginLeft: "100px"}}
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "8px", color: "#777" }}>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "14px", marginTop: "10px", color: "#777" }}>Type:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        style={inputStyles}
                    >
                        <option value="CAT">Cat</option>
                        <option value="DOG">Dog</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "14px", marginTop: "10px", color: "#777" }}>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "14px", marginTop: "10px", color: "#777" }}>Sex:</label>
                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        style={inputStyles}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "14px", marginTop: "10px", color: "#777" }}>Weight (kg):</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "14px", marginTop: "10px", color: "#777" }}>Breed:</label>
                    <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        style={inputStyles}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
                    <button style={buttonStyles} type="submit">Save</button>
                    <button className="rounded-1" style={{padding: "8px 20px", backgroundColor: "white", border: "1"}} type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const inputStyles = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#fdf8f8",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#555",
};

const buttonStyles = {
    padding: "12px 30px",
    fontSize: "17px",
    borderRadius: "4px",
    backgroundColor: "#a13f3f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
};

buttonStyles[':hover'] = {
    backgroundColor: "rgba(67,13,13,0.5)",
};


export default EditPetModal;