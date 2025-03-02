import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";

const QuarantineManagement = () => {
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [sectors, setSectors] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
            alert("All quarantines in sector deleted successfully!");
        } catch (error) {
            console.error("Error deleting quarantines:", error);
            alert("Failed to delete quarantines.");
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
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
        if (!formData.reason || !formData.startDate || !formData.endDate || !formData.sector || !formData.pet) {
            alert("Please fill all required fields.");
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

            alert("Quarantine added successfully!");
            closeAddModal();
        } catch (error) {
            console.error("Error adding quarantine:", error);
            alert("Failed to add quarantine.");
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
                <h3>Current Quarantines by Sector</h3>
                <div className="bg-table element-space">
                    {sectors.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">
                            <thead>
                            <tr>
                                <th>Sector ID</th>
                                <th>Distinct Reasons</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sectors.map((sector) => (
                                <tr key={sector.sectorId}>
                                    <td>{sector.sectorId}</td>
                                    <td>{sector.reasons.join(", ")}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleViewSectorQuarantines(sector.sectorId)}
                                        >
                                            View Quarantines
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
                    <div style={modalOverlayStyles}>
                        <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                            <h3>Add Quarantine</h3>
                            <form onSubmit={handleAddSubmit}>
                                <label>
                                    Reason:
                                    <input
                                        type="text"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleAddChange}
                                        placeholder="Enter reason"
                                        style={{ width: "100%", marginTop: "5px" }}
                                        required
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleAddChange}
                                        placeholder="Enter description"
                                        style={{ width: "100%", marginTop: "5px" }}
                                    />
                                </label>
                                <label>
                                    Start Date:
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleAddChange}
                                        style={{ width: "100%", marginTop: "5px" }}
                                        required
                                    />
                                </label>
                                <label>
                                    End Date:
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleAddChange}
                                        style={{ width: "100%", marginTop: "5px" }}
                                        required
                                    />
                                </label>
                                <label>
                                    Status:
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleAddChange}
                                        style={{ width: "100%", marginTop: "5px" }}
                                    >
                                        <option value="CURRENT">Current</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </label>
                                <label>
                                    Sector:
                                    <select
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleAddChange}
                                        style={{ width: "100%", marginTop: "5px" }}
                                        required
                                    >
                                        <option value="">Select a sector</option>
                                        {allSectors.map((sector) => (
                                            <option key={sector.id} value={sector.id}>
                                                Sector {sector.id}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Pet:
                                    <select
                                        name="pet"
                                        value={formData.pet}
                                        onChange={handleAddChange}
                                        style={{ width: "100%", marginTop: "5px" }}
                                        required
                                    >
                                        <option value="">Select a pet</option>
                                        {pets.map((pet) => (
                                            <option key={pet.id} value={pet.id}>
                                                {pet.name} (ID: {pet.id})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={closeAddModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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

export default QuarantineManagement;