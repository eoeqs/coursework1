import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";

const SectorQuarantineManagement = () => {
    const { sectorId } = useParams();
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [quarantines, setQuarantines] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("CURRENT");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const statusParam = filterStatus;
                const quarantinesResponse = await axiosInstance.get(`/quarantine/sector/${sectorId}`, {
                    params: { status: statusParam, page: 0, size: 100 },
                });
                const quarantinesData = quarantinesResponse.data;

                const quarantinesWithNames = await Promise.all(
                    quarantinesData.map(async (quarantine) => {
                        const petResponse = await axiosInstance.get(`/pets/pet/${quarantine.pet}`);
                        return {
                            ...quarantine,
                            petName: petResponse.data.name,
                        };
                    })
                );
                setQuarantines(quarantinesWithNames);
                console.log("Fetched quarantines:", quarantinesWithNames);

                const sectorsResponse = await axiosInstance.get("/sectors/all");
                setSectors(sectorsResponse.data);
            } catch (error) {
                console.error("Error fetching quarantine data:", error);
                setError("Failed to fetch quarantine data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance, sectorId, filterStatus]);

    const handleReleasePet = async (quarantineId, petId) => {
        if (!window.confirm("Are you sure you want to release this pet from quarantine?")) return;

        try {
            await axiosInstance.delete(`/quarantine/delete/${quarantineId}`);
            await axiosInstance.put(`/pets/unbind/${petId}`);
            setQuarantines(quarantines.filter((q) => q.id !== quarantineId));
            alert("Pet released from quarantine successfully!");
        } catch (error) {
            console.error("Error releasing pet:", error);
            alert("Failed to release pet.");
        }
    };

    const handleMovePet = async (quarantineId, petId, newSectorId) => {
        if (!window.confirm("Are you sure you want to move this pet to another sector?")) return;

        try {
            await axiosInstance.put(`/pets/sector-place/${petId}`, null, {
                params: { sectorId: newSectorId },
            });
            const updatedQuarantineResponse = await axiosInstance.get(`/quarantine/${quarantineId}`);
            setQuarantines(
                quarantines.map((q) =>
                    q.id === quarantineId ? { ...updatedQuarantineResponse.data, petName: q.petName } : q
                )
            );
            alert("Pet moved to new sector successfully!");

        } catch (error) {
            console.error("Error moving pet:", error);
            alert("Failed to move pet.");
        }
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
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
                <h2>Quarantine Management - Sector {sectorId}</h2>
                <div style={{ marginBottom: "20px" }}>
                    <label>
                        Filter Quarantines:
                        <select value={filterStatus} onChange={handleFilterChange} style={{ marginLeft: "10px" }}>
                            <option value="CURRENT">Current</option>
                            <option value="DONE">Completed</option>
                        </select>
                    </label>
                </div>
                <div className="bg-table element-space">
                    {quarantines.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">
                            <thead>
                            <tr>
                                <th>Pet Name</th>
                                <th>Reason</th>
                                <th>Description</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {quarantines.map((quarantine) => (
                                <tr
                                    key={quarantine.id}
                                    style={{ color: quarantine.status === "DONE" ? "red" : "inherit" }}
                                >
                                    <td>{quarantine.petName}</td>
                                    <td>{quarantine.reason}</td>
                                    <td>{quarantine.description}</td>
                                    <td>{new Date(quarantine.endDate).toLocaleString()}</td>
                                    <td>{quarantine.status}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleReleasePet(quarantine.id, quarantine.pet)}
                                            disabled={quarantine.status === "DONE"}
                                        >
                                            Release
                                        </button>
                                        <select
                                            onChange={(e) => handleMovePet(quarantine.id, quarantine.pet, e.target.value)}
                                            defaultValue=""
                                            disabled={quarantine.status === "DONE"}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            <option value="" disabled>
                                                Move to...
                                            </option>
                                            {sectors
                                                .filter((sector) => sector.id !== parseInt(sectorId))
                                                .map((sector) => (
                                                    <option key={sector.id} value={sector.id}>
                                                        Sector {sector.id}
                                                    </option>
                                                ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No quarantines found for this sector.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectorQuarantineManagement;