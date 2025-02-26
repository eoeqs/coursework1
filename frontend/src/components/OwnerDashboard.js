import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import PetProfile from "./PetProfile";
import { useNavigate } from "react-router-dom";
import NewPetForm from "./NewPetForm";
import EditOwnerModal from "./EditOwnerModal";

const OwnerDashboard = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const [ownerInfo, setOwnerInfo] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [isNewPetFormOpen, setIsNewPetFormOpen] = useState(false);
    const [isEditOwnerModalOpen, setIsEditOwnerModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const currentUserResponse = await axiosInstance.get("/users/current-user-info");
                const ownerId = currentUserResponse.data.id;

                const ownerInfoResponse = await axiosInstance.get(`/users/user-info/${ownerId}`);
                setOwnerInfo(ownerInfoResponse.data);
                console.log(ownerInfoResponse.data)

                const petsResponse = await axiosInstance.get(`/pets/user-pets`);
                setPets(petsResponse.data);
            } catch (error) {
                console.error("Error fetching owner data or pets:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, axiosInstance]);

    const handleViewPetProfile = (petId) => {
        navigate(`/pet/${petId}`);
    };

    const closePetProfile = () => {
        setSelectedPetId(null);
    };

    const handleAddNewPet = () => {
        setIsNewPetFormOpen(true);
    };

    const handlePetCreated = (newPet) => {
        setPets([...pets, newPet]);
        setIsNewPetFormOpen(false);
    };

    const handleCancelNewPet = () => {
        setIsNewPetFormOpen(false);
    };

    const handleSaveOwner = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/users/update-user/${ownerInfo.id}`, updatedData);
            setOwnerInfo(response.data);
            setIsEditOwnerModalOpen(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating owner profile:", error);
            alert("Failed to update profile. Please try again later.");
        }
    };

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    if (!ownerInfo) {
        return <div>No owner information found.</div>;
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <div className="mb-4 ps-2">
                        {ownerInfo.photoUrl ? (
                            <img
                                className="avatar"
                                src={ownerInfo.photoUrl}
                                alt={`${ownerInfo.name}'s avatar`}
                                style={{ width: '250px', height: '250px', borderRadius: '2%' }}
                            />
                        ) : (
                            <div>Owner profile pic placeholder</div>
                        )}
                    </div>
                    <div>
                        <h2>{ownerInfo.name} {ownerInfo.surname}</h2>
                        <p><strong>Email:</strong> {ownerInfo.email || "Not specified"}</p>
                        <p><strong>Phone:</strong> {ownerInfo.phoneNumber || "Not specified"}</p>
                        <button onClick={() => setIsEditOwnerModalOpen(true)}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div style={{flex: 1, marginLeft: "20px"}}>
                    <h2>My Pets</h2>

                    {pets.length > 0 ? (
                        <table border="1" cellPadding="10" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Sex</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pets.map((pet) => (
                                <tr key={pet.id}>
                                    <td>{pet.name}</td>
                                    <td>{pet.age}</td>
                                    <td>{pet.sex}</td>
                                    <td>
                                        <button onClick={() => handleViewPetProfile(pet.id)}>
                                            View Pet Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pets found.</p>
                    )}
                    <button onClick={handleAddNewPet} style={{marginBottom: "10px"}}>
                        Add New Pet
                    </button>
                </div>
            </div>

            {isNewPetFormOpen && (
                <NewPetForm
                    onPetCreated={handlePetCreated}
                    onCancel={handleCancelNewPet}
                />
            )}

            {selectedPetId && (
                <PetProfile petId={selectedPetId} onClose={closePetProfile} />
            )}

            {isEditOwnerModalOpen && (
                <EditOwnerModal
                    ownerInfo={ownerInfo}
                    onClose={() => setIsEditOwnerModalOpen(false)}
                    onSave={handleSaveOwner}
                />
            )}
        </div>
    );
};

export default OwnerDashboard;