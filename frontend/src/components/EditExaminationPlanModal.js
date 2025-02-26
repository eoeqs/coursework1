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
            <div className="modal-header">
                <h3>Edit Examination Plan</h3>
            </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", marginBottom: "8px", color: "#555555" }}>Examination Plan:</label>
                        <textarea
                            value={plan}
                            onChange={handleChange}
                            rows={4}
                            cols={40}
                            className="form-info"
                            style={{ width: "100%", padding: "8px",backgroundColor: "#fbf7f7" }}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "20px"}}>
                        <button className="form-button" type="submit" style={{padding: "8px 23px"}}>Save</button>
                        <button className="rounded-1 border-1" type="button" style={{padding: "8px 16px", backgroundColor: "white"}} onClick={onClose}>Cancel</button>
                    </div>
                </form>
        </div>
);
};

export default EditExaminationPlanModal;