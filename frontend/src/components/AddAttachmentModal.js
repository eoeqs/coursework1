import React, { useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const AddAttachmentModal = ({ diagnoses, anamnesisId, onClose, onSave }) => {
    const axiosInstance = useAxiosWithAuth();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        anamnesis: anamnesisId,
        diagnosis: "",
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Name is required.");
            return;
        }
        if (formData.name.length > 255) {
            setError("Name must not exceed 255 characters.");
            return;
        }
        if (formData.description.length > 1000) {
            setError("Description must not exceed 1000 characters.");
            return;
        }
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append(
                "diagnosticAttachmentDTO",
                JSON.stringify({
                    ...formData,
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                })
            );
            formDataToSend.append("file", file);

            const response = await axiosInstance.post("/diagnostic-attachment/new", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage("Attachment added successfully.");
            onSave(response.data);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error adding attachment:", error);
            setError("Failed to add attachment: maximum upload size exceeded or server error.");
        }
    };

    return (
        <div style={modalOverlayStyles} onClick={onClose}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <h3>Add Diagnostic Attachment</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter attachment name"
                            style={{ width: "100%", marginTop: "5px" }}
                            maxLength={255}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter attachment description (optional, max 1000 characters)"
                            rows={3}
                            cols={40}
                            style={{ width: "100%", marginTop: "5px" }}
                            maxLength={1000}
                        />
                        <small>{formData.description.length}/1000 characters</small>
                    </label>
                    <label>
                        Diagnosis (optional):
                        <select
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        >
                            <option value="">Select a diagnosis (optional)</option>
                            {diagnoses.map((diag) => (
                                <option key={diag.id} value={diag.id}>
                                    {diag.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        File:
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={{ width: "100%", marginTop: "5px" }}
                            required
                        />
                    </label>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button type="submit">Add</button>
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
};

export default AddAttachmentModal;