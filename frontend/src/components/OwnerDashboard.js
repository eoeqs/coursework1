import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import PetProfile from "./PetProfile";
import { useNavigate } from "react-router-dom";
import NewPetForm from "./NewPetForm";
import EditOwnerModal from "./EditOwnerModal";
import Header from "./Header";

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
            const response = await axiosInstance.put(`/users/update-user/`, updatedData);
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
        <div style={{backgroundColor: '#f8efef'}}>
            <Header/>
            <div className="container mt-1" style={{display: "flex", gap: "150px"}}>
                <div className="container rounded-3 vet-card" style={{flex: 0, maxWidth: '450px', padding: "30px 30px", margin: '10px 20px', backgroundColor: '#e6c8c8'}}>
                    <div className="mb-3 ps-2" style={{
                        maxWidth: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '250px'
                    }}>
                        {ownerInfo.photoUrl ? (
                            <img
                                className="avatar"
                                src={ownerInfo.photoUrl}
                                alt={`${ownerInfo.name}'s avatar`}
                                style={{width: '250px', height: '250px', borderRadius: '2%'}}
                            />
                        ) : (
                            <div>Owner profile pic placeholder</div>
                        )}
                    </div>
                    <div>
                        <div style={{padding: "0px 0 0 7% "}}>
                            <h3><strong>{ownerInfo.name} {ownerInfo.surname}</strong></h3>
                        </div>
                        <div style={{padding: "0px 0px"}}>
                            <p><strong>Email:</strong> {ownerInfo.email || "Not specified"}</p>
                            <p><strong>Phone:</strong> {ownerInfo.phoneNumber || "Not specified"}</p>
                            <div style={{padding: "0px 25%"}}>
                                <button className="button btn-no-border rounded-3" onClick={() => setIsEditOwnerModalOpen(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className="bg-table element-space wards " style={{flex: 1, margin: '10px'}}>

                    <h2 className="table-appointment">My Pets</h2>

                    {pets.length > 0 ? (
                        <table cellPadding="2" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {pets.map((pet) => (
                                <tr key={pet.id}>
                                    <td style={{padding: '20px'}}>
                                        {pet.photoUrl ? (
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
                                            <p>(anonymous)</p>
                                        )} {"\t"}
                                        <strong>{pet.name}</strong>{" "} {"\t"}
                                        ({pet.type}, {" "}
                                        {pet.age} y.o. {" "}
                                        {pet.sex})</td>
                                    <td style={{textAlign: 'right'}}>
                                        <button className="button btn-no-border"
                                                onClick={() => handleViewPetProfile(pet.id)}>
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
                    <button className="button btn-no-border rounded-3" onClick={handleAddNewPet} style={{marginBottom: "10px"}}>
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