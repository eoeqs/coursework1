import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditPetModal from "./EditPetModal";

const AllPets = () => {
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);

    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            setError(null);

            try {
                const petsResponse = await axiosInstance.get("/pets/all-pets");
                setPets(petsResponse.data);
            } catch (error) {
                console.error("Error fetching pets:", error);
                setError("Failed to fetch pets. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [axiosInstance]);

    const openEditPetModal = (pet) => {
        setSelectedPet(pet);
        setIsEditPetModalOpen(true);
    };

    const closeEditPetModal = () => {
        setIsEditPetModalOpen(false);
        setSelectedPet(null);
    };

    const handleViewPetProfile = (petId) => {
        navigate(`/pet/${petId}`);
    };

    const handleSavePet = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/pets/update-pet/${selectedPet.id}`, updatedData);
            setPets(pets.map((p) => (p.id === selectedPet.id ? response.data : p)));
            alert("Pet profile updated successfully!");
            closeEditPetModal();
        } catch (error) {
            console.error("Error updating pet:", error);
            alert("Failed to update pet.");
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
                <h2>All Pets</h2>
                <div className="bg-table element-space" style={{ marginBottom: "20px" }}>
                    {pets.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {pets.map((pet) => (
                                <tr key={pet.id}>
                                    <td>{pet.name}</td>
                                    <td>{pet.type}</td>
                                    <td>{pet.breed}</td>
                                    <td>{pet.age}</td>
                                    <td>{pet.sex}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleViewPetProfile(pet.id)}
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditPetModal(pet)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pets found.</p>
                    )}
                </div>
            </div>

            {isEditPetModalOpen && (
                <EditPetModal
                    petInfo={selectedPet}
                    onClose={closeEditPetModal}
                    onSave={handleSavePet}
                />
            )}
        </div>
    );
};

export default AllPets;