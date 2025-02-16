import {useState} from "react";

const EditExaminationPlanModal = ({ examinationPlan, onClose, onSave }) => {
    const [plan, setPlan] = useState(examinationPlan || "");

    const handleChange = (e) => {
        setPlan(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(plan);
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
            <h3>Edit Examination Plan</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Examination Plan:</label>
                    <textarea
                        value={plan}
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

export default EditExaminationPlanModal;