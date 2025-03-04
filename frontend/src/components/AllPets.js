import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditPetModal from "./EditPetModal";
import '../AllEntitiesPage.css';
import PawStub from "../pics/paw.png";

const AllPets = () => {
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredPets = pets.filter((pet) => {
        const matchesType = filterType === "all" || pet.type.toLowerCase() === filterType;
        const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

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
            closeEditPetModal();
        } catch (error) {
            console.error("Error updating pet:", error);
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
            <div className="entities_container" style={{ padding: "20px"}}>
                <h2>All Pets</h2>

                <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: "5px", borderRadius: "5px" }}
                    >
                        <option value="all">All</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: "5px", borderRadius: "5px", flex: 1 }}
                    />
                </div>

                <div className="bg-entities element-space" style={{ marginBottom: "20px" }}>
                    {filteredPets.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="entities-table table-right-end">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Breed</th>
                                <th>Age</th>
                                <th>Sex</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPets.map((pet) => (
                                <tr key={pet.id}>
                                    <td>{pet.id}</td>
                                    <td>{pet.photoUrl ? (
                                        <img className="avatar"
                                             src={pet.photoUrl}
                                             alt={`${pet.name}'s avatar`}
                                             style={{
                                                 width: '50px',
                                                 height: '50px',
                                                 borderRadius: '50%',
                                                 marginRight: '20px'
                                             }}
                                        />
                                    ) : (
                                        <img
                                            className="avatar"
                                            src={PawStub}
                                            alt={`photo stub`}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                marginRight: '20px'
                                            }}
                                        />)}</td>
                                    <td>{pet.name}</td>
                                    <td>{pet.type}</td>
                                    <td>{pet.breed}</td>
                                    <td>{pet.age} y.o.</td>
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
                                            style={{marginLeft: "10px"}}
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