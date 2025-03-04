import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import "../pinkmodal.css";

const QuarantineManagement = () => {
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [sectors, setSectors] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        reason: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "CURRENT",
        sector: "",
        pet: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const quarantinesResponse = await axiosInstance.get("/quarantine/all");
                const quarantines = quarantinesResponse.data;

                const activeQuarantines = quarantines.filter((q) => q.status !== "DONE");

                const sectorMap = new Map();
                activeQuarantines.forEach((quarantine) => {
                    if (!sectorMap.has(quarantine.sector)) {
                        sectorMap.set(quarantine.sector, { reasons: new Set(), ids: new Set() });
                    }
                    sectorMap.get(quarantine.sector).reasons.add(quarantine.reason);
                    sectorMap.get(quarantine.sector).ids.add(quarantine.id);
                });

                const sectorData = Array.from(sectorMap, ([sectorId, data]) => ({
                    sectorId,
                    reasons: Array.from(data.reasons),
                    ids: Array.from(data.ids),
                }));
                setSectors(sectorData);

                const sectorsResponse = await axiosInstance.get("/sectors/all");
                setAllSectors(sectorsResponse.data);

                const petsResponse = await axiosInstance.get("/pets/all-pets");
                setPets(petsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance]);

    const filteredSectors = sectors.filter((sector) =>
        sector.reasons.some((reason) =>
            reason.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleViewSectorQuarantines = (sectorId) => {
        navigate(`/quarantine/sector/${sectorId}`);
    };

    const handleDeleteSectorQuarantines = async (sectorId, quarantineIds) => {
        if (!window.confirm("Are you sure you want to delete all quarantines in this sector?")) return;

        try {
            await Promise.all(
                quarantineIds.map((id) => axiosInstance.delete(`/quarantine/delete/${id}`))
            );
            setSectors(sectors.filter((sector) => sector.sectorId !== sectorId));
        } catch (error) {
            console.error("Error deleting quarantines:", error);
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setFormError("");
        setFormData({
            reason: "",
            description: "",
            startDate: "",
            endDate: "",
            status: "CURRENT",
            sector: "",
            pet: "",
        });
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.reason || !formData.startDate || !formData.endDate || !formData.sector || !formData.pet) {
            setFormError("All fields except description are required.");
            return;
        }

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (endDate < startDate) {
            setFormError("End date cannot be earlier than start date.");
            return;
        }

        try {
            const response = await axiosInstance.post("/quarantine/save", formData);
            const newQuarantine = response.data;

            const updatedSectors = [...sectors];
            const sectorIndex = updatedSectors.findIndex((s) => s.sectorId === newQuarantine.sector);
            if (sectorIndex >= 0) {
                if (!updatedSectors[sectorIndex].reasons.includes(newQuarantine.reason)) {
                    updatedSectors[sectorIndex].reasons.push(newQuarantine.reason);
                }
                updatedSectors[sectorIndex].ids.push(newQuarantine.id);
            } else {
                updatedSectors.push({
                    sectorId: newQuarantine.sector,
                    reasons: [newQuarantine.reason],
                    ids: [newQuarantine.id],
                });
            }
            setSectors(updatedSectors);

            closeAddModal();
        } catch (error) {
            console.error("Error adding quarantine:", error);
            setFormError("Failed to add quarantine. Please try again.");
        }
    };

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mt-3" style={{ padding: "20px" }}>
                <h2>Quarantine Management</h2>
                <button
                    className="button rounded-3 btn-no-border"
                    onClick={openAddModal}
                    style={{ marginBottom: "20px" }}
                >
                    Add Quarantine
                </button>

                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search by reason..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: "10px",
                            width: "100%",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                        }}
                    />
                </div>

                <h3>Current Quarantines by Sector</h3>
                <div className="bg-table element-space">
                    {filteredSectors.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">
                            <thead>
                            <tr>
                                <th>Sector ID</th>
                                <th>Distinct Reasons</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSectors.map((sector) => (
                                <tr key={sector.sectorId}>
                                    <td>{sector.sectorId}</td>
                                    <td>{sector.reasons.join(", ")}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleViewSectorQuarantines(sector.sectorId)}
                                        >
                                            View All
                                        </button>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleDeleteSectorQuarantines(sector.sectorId, sector.ids)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Delete All
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No active quarantines found.</p>
                    )}
                </div>

                {isAddModalOpen && (
                    <div className="pink-modal-overlay" onClick={closeAddModal}>
                        <div className="pink-modal-container" onClick={(e) => e.stopPropagation()}>
                            <div className="pink-modal-header">
                                <h3 className="pink-modal-header-title">Add Quarantine</h3>
                            </div>
                            {formError && <p className="pink-modal-error">{formError}</p>}
                            <form onSubmit={handleAddSubmit} className="pink-modal-form">
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">Reason:</label>
                                    <input
                                        type="text"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleAddChange}
                                        placeholder="Enter reason"
                                        className="pink-modal-input"
                                        required
                                    />
                                </div>
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">Description:</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleAddChange}
                                        placeholder="Enter description"
                                        className="pink-modal-textarea"
                                    />
                                </div>
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">Start Date:</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleAddChange}
                                        className="pink-modal-input"
                                        required
                                    />
                                </div>
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">End Date:</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleAddChange}
                                        min={formData.startDate}
                                        className="pink-modal-input"
                                        required
                                    />
                                </div>
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">Status:</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleAddChange}
                                        className="pink-modal-select"
                                    >
                                        <option value="CURRENT">Current</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">Sector:</label>
                                    <select
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleAddChange}
                                        className="pink-modal-select"
                                        required
                                    >
                                        <option value="">Select a sector</option>
                                        {allSectors.map((sector) => (
                                            <option key={sector.id} value={sector.id}>
                                                Sector {sector.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pink-modal-input-section">
                                    <label className="pink-modal-label">Pet:</label>
                                    <select
                                        name="pet"
                                        value={formData.pet}
                                        onChange={handleAddChange}
                                        className="pink-modal-select"
                                        required
                                    >
                                        <option value="">Select a pet</option>
                                        {pets.map((pet) => (
                                            <option key={pet.id} value={pet.id}>
                                                {pet.name} (ID: {pet.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pink-modal-footer">
                                    <button type="submit" className="pink-modal-action-button">Save</button>
                                    <button type="button" onClick={closeAddModal} className="pink-modal-cancel-button">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuarantineManagement;