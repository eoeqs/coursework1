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
            } catch (error) {
                console.error("Error updating pet avatar:", error);
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

                <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "15px"}}>
                    <button className="form-button" type="submit" style={{padding: "5px 35px", color: "white"}}>
                        Save
                    </button>
                    <button className="rounded-2" type="button" onClick={onClose}
                            style={{padding: "5px 26px", backgroundColor: "#ffffff", border: "1", borderColor: "#c1c0c0"}}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const inputStyles = {
    padding: "7px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#fdf8f8",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#555",
};


export default EditPetModal;