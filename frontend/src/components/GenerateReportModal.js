import React, { useState } from "react";

const GenerateReportModal = ({ anamnesisId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        finalDiagnosis: "",
        finalCondition: "",
        recommendations: "",
        additionalObservations: "",
        ownerRemarks: "",
        nextExaminationDate: "",
    });

    const handleFormChange = (e) => {
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
                <h3>Generate Report</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Final Diagnosis:
                        <input
                            type="text"
                            name="finalDiagnosis"
                            value={formData.finalDiagnosis}
                            onChange={handleFormChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Final Condition:
                        <input
                            type="text"
                            name="finalCondition"
                            value={formData.finalCondition}
                            onChange={handleFormChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Recommendations:
                        <textarea
                            name="recommendations"
                            value={formData.recommendations}
                            onChange={handleFormChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Additional Observations:
                        <textarea
                            name="additionalObservations"
                            value={formData.additionalObservations}
                            onChange={handleFormChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Owner Remarks:
                        <textarea
                            name="ownerRemarks"
                            value={formData.ownerRemarks}
                            onChange={handleFormChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <label>
                        Next Examination Date:
                        <input
                            type="datetime-local"
                            name="nextExaminationDate"
                            value={formData.nextExaminationDate}
                            onChange={handleFormChange}
                            style={{ width: "100%", marginTop: "5px" }}
                        />
                    </label>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button type="submit">Generate</button>
                        <button type="button" onClick={onClose}>Cancel</button>
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

export default GenerateReportModal;