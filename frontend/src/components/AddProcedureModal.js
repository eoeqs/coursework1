import React, { useState } from "react";

const AddProcedureModal = ({ onClose, onSave, petId, anamnesisId, vetId }) => {
    const [procedureData, setProcedureData] = useState({
        type: "",
        name: "",
        date: "",
        description: "",
        notes: "",
    });

    const procedureTypes = [
        { value: "DIAGNOSIS", label: "Diagnosis" },
        { value: "TREATMENT", label: "Treatment" },
        { value: "EXAMINATION", label: "Examination" },
        { value: "PROCEDURE", label: "Procedure" },
        { value: "SURGERY", label: "Surgery" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProcedureData({ ...procedureData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...procedureData,
            pet: petId,
            vet: vetId,
            anamnesis: anamnesisId,
        };
        onSave(data);
    };

    return (
        <div style={modalOverlayStyles} onClick={onClose}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyles}>
                    <h3 style={headerTextStyles}>Add New Procedure</h3>
                </div>
                <form onSubmit={handleSubmit} style={formStyles}>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Type:</label>
                        <select
                            name="type"
                            value={procedureData.type}
                            onChange={handleChange}
                            style={selectStyles}
                            required
                        >
                            <option value="" disabled>Select a type</option>
                            {procedureTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={procedureData.name}
                            onChange={handleChange}
                            style={inputStyles}
                            placeholder="Enter procedure name"
                            required
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Date:</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={procedureData.date}
                            onChange={handleChange}
                            style={inputStyles}
                            required
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Description:</label>
                        <textarea
                            name="description"
                            value={procedureData.description}
                            onChange={handleChange}
                            style={textareaStyles}
                            placeholder="Enter procedure description"
                            required
                        />
                    </div>
                    <div style={inputSectionStyles}>
                        <label style={labelStyles}>Notes:</label>
                        <textarea
                            name="notes"
                            value={procedureData.notes}
                            onChange={handleChange}
                            style={textareaStyles}
                            placeholder="Enter additional notes (optional)"
                        />
                    </div>
                    <div style={footerStyles}>
                        <button type="submit" style={buttonStyles}>Save</button>
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

export default AddProcedureModal;