import React, { useState, useEffect } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const AttachmentDetailsModal = ({ attachment, onClose }) => {
    const axiosInstance = useAxiosWithAuth();
    const [diagnosisName, setDiagnosisName] = useState("Loading...");
    const [error, setError] = useState(null);

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
                <h3>Attachment Details</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p><strong>Name:</strong> {attachment.name}</p>
                <p><strong>Description:</strong> {attachment.description || "No description"}</p>
                <p><strong>Upload Date:</strong> {new Date(attachment.uploadDate).toLocaleString()}</p>
                <p><strong>Diagnosis:</strong> {diagnosisName}</p>
                {attachment.fileUrl ? (
                    <img
                        src={attachment.fileUrl}
                        alt={attachment.name}
                        style={{ maxWidth: "100%", maxHeight: "400px", marginTop: "10px" }}
                    />
                ) : (
                    <p>No image available</p>
                )}
                <button
                    className="button btn-no-border rounded-3"
                    onClick={onClose}
                    style={{ marginTop: "20px" }}
                >
                    Close
                </button>
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