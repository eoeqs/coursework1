import React, { useState, useEffect } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const AttachmentDetailsModal = ({ attachment, onClose }) => {
    const axiosInstance = useAxiosWithAuth();
    const [diagnosisName, setDiagnosisName] = useState("Loading...");
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    useEffect(() => {
        const fetchDiagnosisName = async () => {
            if (attachment.diagnosis) {
                try {
                    const response = await axiosInstance.get(`/diagnosis/${attachment.diagnosis}`);
                    setDiagnosisName(response.data.name || "Unknown Diagnosis");
                } catch (err) {
                    console.error("Error fetching diagnosis:", err);
                    setDiagnosisName("Error fetching diagnosis");
                    setError("Failed to load diagnosis name.");
                }
            } else {
                setDiagnosisName("Not specified");
            }
        };

        fetchDiagnosisName();
    }, [attachment.diagnosis, axiosInstance]);


    return (
        <div style={modalOverlayStyles} onClick={onClose}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header"><h3>Attachment Details</h3> </div>
                <div style={{backgroundColor: "#faf2f2", margin: "3px", padding: "10px", borderRadius: "10px"}}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p><strong>Name:</strong> {attachment.name}</p>
                <p><strong>Description:</strong> {attachment.description || "No description"}</p>
                <p><strong>Upload Date:</strong> {new Date(attachment.uploadDate).toLocaleString()}</p>
                <p><strong>Diagnosis:</strong> {diagnosisName}</p>
                {attachment.fileUrl ? (
                    imageError ? (
                        <div>
                            <p>This file format is not supported for preview. You can <a href={attachment.fileUrl} download={attachment.name} style={{color: '#802222'}}>
                                download </a> it.</p>
                        </div>
                    ) : (<a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            src={attachment.fileUrl}
                            alt={attachment.name}
                            style={{ maxWidth: "100%", maxHeight: "100%", marginTop: "10px" }}
                            onError={handleImageError}
                        />
                        </a>
                    )
                ) : (
                    <p>No file available</p>
                )}
            </div>
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
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
};

export default AttachmentDetailsModal;