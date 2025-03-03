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
                <div style={headerStyles}>
                    <h3 style={headerTextStyles}>Add Diagnostic Attachment</h3>
                </div>
                {error && <p style={errorStyles}>{error}</p>}
                <form onSubmit={handleSubmit} style={formStyles}>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter attachment name"
                            style={inputStyles}
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter attachment description"
                            style={textareaStyles}
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Diagnosis:</label>
                        <select
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            style={selectStyles}
                        >
                            <option value="">Select a diagnosis (optional)</option>
                            {diagnoses.map((diag) => (
                                <option key={diag.id} value={diag.id}>
                                    {diag.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>File:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={fileInputStyles}
                        />
                    </div>
                    <div style={footerStyles}>
                        <button type="submit" style={buttonStyles}>Add</button>
                        <button type="button" onClick={onClose} style={cancelButtonStyles}>Cancel</button>
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
    backgroundColor: "#FFF3F3",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "500px",
    maxWidth: "90%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #F8C9D4",
};

const headerStyles = {
    textAlign: "center",
    marginBottom: "15px",
    borderBottom: "2px solid #F8C9D4",
    paddingBottom: "10px",
};

const headerTextStyles = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#A13F3F",
    margin: 0,
};

const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
};

const inputSectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
};

const labelStyles = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#883030",
};

const inputStyles = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #F8C9D4",
    fontSize: "14px",
    width: "100%",
    backgroundColor: "#FFF8F8",
    color: "#682020",
    outline: "none",
    transition: "border-color 0.3s",
};

const textareaStyles = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #F8C9D4",
    fontSize: "14px",
    height: "80px",
    width: "100%",
    resize: "none",
    backgroundColor: "#FFF8F8",
    color: "#682020",
    outline: "none",
    transition: "border-color 0.3s",
};

const selectStyles = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #F8C9D4",
    fontSize: "14px",
    width: "100%",
    backgroundColor: "#FFF8F8",
    color: "#682020",
    outline: "none",
    transition: "border-color 0.3s",
};

const fileInputStyles = {
    padding: "8px 0",
    fontSize: "14px",
    width: "100%",
    color: "#682020",
};

const errorStyles = {
    color: "#D9534F",
    fontSize: "12px",
    marginBottom: "10px",
    textAlign: "center",
};

const footerStyles = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
};

const buttonStyles = {
    padding: "8px 16px",
    backgroundColor: "#DA9A9A",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
};

const cancelButtonStyles = {
    padding: "8px 16px",
    backgroundColor: "#E8D5D5",
    color: "#682020",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
};

export default AddAttachmentModal;