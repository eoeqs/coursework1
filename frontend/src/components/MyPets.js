import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import { useNavigate } from "react-router-dom";
import NewPetForm from "./NewPetForm";
import Header from "./Header";
import PawStub from "../pics/paw.png";

const MyPets = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNewPetFormOpen, setIsNewPetFormOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchPets = async () => {
            setLoading(true);
            setError(null);

            try {
                const petsResponse = await axiosInstance.get(`/pets/user-pets`);
                setPets(petsResponse.data);
            } catch (error) {
                console.error("Error fetching pets:", error);
                setError("Failed to fetch pets. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [token, axiosInstance]);

    const handleViewPetProfile = (petId) => {
        navigate(`/pet/${petId}`);
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

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    return (
        <div style={{ backgroundColor: "#f8efef" }}>
            <Header />
            <div className="container mt-1">
                <div className="bg-table element-space wards" style={{ margin: "10px" }}>
                    <h2 className="table-appointment">My Pets</h2>

                    {pets.length > 0 ? (
                        <table cellPadding="2" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {pets.map((pet) => (
                                <tr key={pet.id}>
                                    <td style={{ padding: "20px" }}>
                                        {pet.photoUrl ? (
                                            <img
                                                className="avatar"
                                                src={pet.photoUrl}
                                                alt={`${pet.name}'s avatar`}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    marginRight: "20px",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                className="avatar"
                                                src={PawStub}
                                                alt="photo stub"
                                                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                            />
                                        )}{" "}
                                        <strong>{pet.name}</strong> {" "} {"\t"}
                                        ({pet.type}, {" "}
                                        {pet.age} y.o. {" "}
                                        {pet.sex})
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleViewPetProfile(pet.id)}
                                        >
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
                    <button
                        className="button btn-no-border rounded-3"
                        onClick={handleAddNewPet}
                        style={{ marginBottom: "10px" }}
                    >
                        Add New Pet
                    </button>
                </div>
            </div>

            {isNewPetFormOpen && (
                <NewPetForm onPetCreated={handlePetCreated} onCancel={handleCancelNewPet} />
            )}
        </div>
    );
};

export default MyPets;