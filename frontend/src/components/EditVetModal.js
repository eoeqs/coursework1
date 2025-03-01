import React, {useState} from "react";
import useAxiosWithAuth from "../AxiosAuth";
//TODO: админ функционал сюда
const EditVetModal = ({vetInfo, onClose, onSave}) => {
    const axiosInstance = useAxiosWithAuth();
    const [formData, setFormData] = useState({
        name: vetInfo?.name || "",
        surname: vetInfo?.surname || "",
        qualification: vetInfo?.qualification || "",
        email: vetInfo?.email || "",
        phoneNumber: vetInfo?.phoneNumber || "",
        schedule: vetInfo?.schedule || "",
        workingHours: vetInfo?.workingHours || "",
        clinic: vetInfo?.clinic || "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const updatedVetData = {
                ...formData,
                id: vetInfo.id,
            };
            const response = await axiosInstance.put(`/users/update-user/`, updatedVetData);
            onSave(response.data);
            onClose();
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating vet profile:", err);
            setError("Failed to update profile. Please try again.");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
                width: "400px",
                maxWidth: "90%",
            }}
        >
            <div className="modal-header">
                <h3>Edit Vet Profile</h3>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Surname:
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Qualification:
                    <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Phone Number:
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Schedule:
                    <input
                        type="text"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Working Hours:
                    <input
                        type="text"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{marginBottom: "10px"}}>
                <label style={{display: "block", fontSize: "14px", marginBottom: "8px", color: "#777"}}>
                    Clinic:
                    <input
                        type="text"
                        name="clinic"
                        value={formData.clinic}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            marginTop: "5px",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                        }}
                    />
                </label>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "20px"}}>
                <button className="form-button" style={{padding: "3px 30px"}} onClick={handleSubmit}>
                    Save
                </button>
                <button className="rounded-1" style={{padding: "3px 20px", backgroundColor: "white", border: "1"}} onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditVetModal;