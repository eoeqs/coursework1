import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import CreateSectorModal from "./CreateSectorModal";

const SectorManagement = () => {
    const axiosInstance = useAxiosWithAuth();
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateSectorModalOpen, setIsCreateSectorModalOpen] = useState(false);

    useEffect(() => {
        const fetchSectors = async () => {
            setLoading(true);
            setError(null);

            try {
                const sectorsResponse = await axiosInstance.get("/sectors/all");
                setSectors(sectorsResponse.data);
            } catch (error) {
                console.error("Error fetching sectors:", error);
                setError("Failed to fetch sectors. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSectors();
    }, [axiosInstance]);

    const openCreateSectorModal = () => {
        setIsCreateSectorModalOpen(true);
    };

    const closeCreateSectorModal = () => {
        setIsCreateSectorModalOpen(false);
    };

    const handleSaveSector = async (sectorData) => {
        try {
            const response = await axiosInstance.post("/sectors/new", sectorData);
            setSectors([...sectors, response.data]);
            alert("Sector created successfully!");
            closeCreateSectorModal();
        } catch (error) {
            console.error("Error creating sector:", error);
            alert("Failed to create sector.");
        }
    };

    const handleDeleteSector = async (sectorId) => {
        if (!window.confirm("Are you sure you want to delete this sector?")) return;

        try {
            await axiosInstance.delete(`/sectors/delete/${sectorId}`);
            setSectors(sectors.filter((sector) => sector.id !== sectorId));
            alert("Sector deleted successfully!");
        } catch (error) {
            console.error("Error deleting sector:", error);
            alert("Failed to delete sector.");
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
                <h2>Sector Management</h2>
                <button
                    className="button rounded-3 btn-no-border"
                    onClick={openCreateSectorModal}
                    style={{ marginBottom: "20px" }}
                >
                    Create Sector
                </button>
                <div className="bg-entities element-space" style={{ marginBottom: "20px" }}>
                    {sectors.length > 0 ? (
                        <table cellPadding="3" cellSpacing="1" className="entities-table">
                            <thead>
                            <tr>
                                <th>Sector ID</th>
                                <th>Category</th>
                                <th>Capacity</th>
                                <th>Occupancy</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sectors.map((sector) => (
                                <tr key={sector.id}>
                                    <td>{sector.id}</td>
                                    <td>{sector.category}</td>
                                    <td>{sector.capacity}</td>
                                    <td>{sector.occupancy}</td>
                                    <td>{sector.isAvailable ? "Yes" : "No"}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleDeleteSector(sector.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No sectors found.</p>
                    )}
                </div>
            </div>

            {isCreateSectorModalOpen && (
                <CreateSectorModal
                    onClose={closeCreateSectorModal}
                    onSave={handleSaveSector}
                />
            )}
        </div>
    );
};

export default SectorManagement;