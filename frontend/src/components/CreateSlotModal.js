import React, { useState, useEffect } from "react";

const CreateSlotModal = ({ onClose, onSave, vets }) => {
    const [slotData, setSlotData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        vetId: "",
        isPriority: false,
    });

    const [error, setError] = useState("");

    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    const calculateEndTime = (startTime) => {
        if (!startTime) return "";
        const [hours, minutes] = startTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        date.setMinutes(date.getMinutes() + 15);

        const formattedHours = String(date.getHours()).padStart(2, "0");
        const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
        return `${formattedHours}:${formattedMinutes}`;
    };

    useEffect(() => {
        const tomorrowDate = getTomorrowDate();
        setSlotData((prev) => ({
            ...prev,
            date: tomorrowDate,
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "startTime") {
            const endTime = calculateEndTime(value);
            setSlotData((prev) => ({
                ...prev,
                startTime: value,
                endTime: endTime,
            }));
        } else {
            setSlotData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (slotData.startTime >= slotData.endTime) {
            setError("Start time must be earlier than end time.");
            return;
        }

        setError("");
        onSave(slotData);
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New Slot</h3>
                </div>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                >
                    <label
                        style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "16px", color: "#555" }}
                    >
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={slotData.date}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "5px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "16px",
                                outline: "none",
                                transition: "border-color 0.3s ease",
                            }}
                        />
                    </label>

                    <label
                        style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "16px", color: "#555" }}
                    >
                        Start Time:
                        <input
                            type="time"
                            name="startTime"
                            value={slotData.startTime}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "5px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "16px",
                                outline: "none",
                                transition: "border-color 0.3s ease",
                            }}
                        />
                    </label>

                    <label
                        style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "16px", color: "#555" }}
                    >
                        End Time:
                        <input
                            type="time"
                            name="endTime"
                            value={slotData.endTime}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "5px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "16px",
                                outline: "none",
                                transition: "border-color 0.3s ease",
                            }}
                        />
                    </label>

                    {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}

                    <label
                        style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "16px", color: "#555" }}
                    >
                        Veterinarian:
                        <select
                            name="vetId"
                            value={slotData.vetId}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "5px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "16px",
                                outline: "none",
                                transition: "border-color 0.3s ease",
                            }}
                        >
                            <option value="">Select Vet</option>
                            {vets.map((vet) => (
                                <option key={vet.id} value={vet.id}>
                                    {vet.name} {vet.surname}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label
                        style={{ display: "flex", gap: "5px", fontSize: "16px", color: "#555" }}
                    >
                        Priority:
                        <input
                            type="checkbox"
                            name="isPriority"
                            checked={slotData.isPriority}
                            onChange={handleChange}
                            style={{
                                width: "15px",
                                height: "15px",
                                marginTop: "5px",
                            }}
                        />
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px" }}>
                        <button className="form-button" type="submit" style={{ padding: "3px 35px", color: "white" }}>
                            Save
                        </button>
                        <button
                            className="rounded-2"
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "3px 26px",
                                backgroundColor: "#ffffff",
                                border: "1",
                                borderColor: "#c1c0c0",
                            }}
                        >
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
    maxHeight: "80vh",
    overflowY: "auto",
};

export default CreateSlotModal;