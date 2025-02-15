import {useState} from "react";

const EditClinicalDiagnosisModal = ({ diagnosis, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: diagnosis ? diagnosis.name : "",
        description: diagnosis ? diagnosis.description : "",
        contagious: diagnosis ? diagnosis.contagious : false,
        examinationPlan: diagnosis ? diagnosis.examinationPlan : "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
        }}>
            <h3>{diagnosis ? "Edit Clinical Diagnosis" : "Add Clinical Diagnosis"}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="contagious"
                            checked={formData.contagious}
                            onChange={handleChange}
                        />
                        Contagious
                    </label>
                </div>
                <div>
                    <label>Examination Plan:</label>
                    <textarea
                        name="examinationPlan"
                        value={formData.examinationPlan}
                        onChange={handleChange}
                        rows={4}
                        cols={40}
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default EditClinicalDiagnosisModal;