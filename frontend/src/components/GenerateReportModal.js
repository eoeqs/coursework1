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
        <div style={modalOverlayStyles} onClick={onClose}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyles}>
                    <h3 style={headerTextStyles}>Generate Report</h3>
                </div>
                <form onSubmit={handleSubmit} style={formStyles}>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Final Diagnosis:</label>
                        <input
                            type="text"
                            name="finalDiagnosis"
                            value={formData.finalDiagnosis}
                            onChange={handleFormChange}
                            style={inputStyles}
                            placeholder="Enter final diagnosis"
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Final Condition:</label>
                        <input
                            type="text"
                            name="finalCondition"
                            value={formData.finalCondition}
                            onChange={handleFormChange}
                            style={inputStyles}
                            placeholder="Enter final condition"
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Recommendations:</label>
                        <textarea
                            name="recommendations"
                            value={formData.recommendations}
                            onChange={handleFormChange}
                            style={textareaStyles}
                            placeholder="Enter recommendations"
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Additional Observations:</label>
                        <textarea
                            name="additionalObservations"
                            value={formData.additionalObservations}
                            onChange={handleFormChange}
                            style={textareaStyles}
                            placeholder="Enter additional observations"
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Owner Remarks:</label>
                        <textarea
                            name="ownerRemarks"
                            value={formData.ownerRemarks}
                            onChange={handleFormChange}
                            style={textareaStyles}
                            placeholder="Enter owner remarks"
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Next Examination Date:</label>
                        <input
                            type="datetime-local"
                            name="nextExaminationDate"
                            value={formData.nextExaminationDate}
                            onChange={handleFormChange}
                            style={inputStyles}
                        />
                    </div>
                    <div style={footerStyles}>
                        <button type="submit" style={buttonStyles}>Generate</button>
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
    maxHeight: "80vh",
    overflowY: "auto",
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

export default GenerateReportModal;