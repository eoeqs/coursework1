import React, { useState } from "react";

const CreateSlotModal = ({ onClose, onSave, vets }) => {
    const [slotData, setSlotData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        vetId: "",
        isPriority: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSlotData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(slotData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Create New Slot</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={slotData.date}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Start Time:
                        <input
                            type="time"
                            name="startTime"
                            value={slotData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        End Time:
                        <input
                            type="time"
                            name="endTime"
                            value={slotData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Veterinarian:
                        <select
                            name="vetId"
                            value={slotData.vetId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Vet</option>
                            {vets.map((vet) => (
                                <option key={vet.id} value={vet.id}>
                                    {vet.name} {vet.surname}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Priority:
                        <input
                            type="checkbox"
                            name="isPriority"
                            checked={slotData.isPriority}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="modal-actions">
                        <button type="submit" className="button btn-no-border">
                            Save
                        </button>
                        <button
                            type="button"
                            className="button btn-no-border"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSlotModal;