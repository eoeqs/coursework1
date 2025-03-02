import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import PawStub from "../pics/paw.png";

const MyWards = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const [doctorPets, setDoctorPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchWards = async () => {
            setLoading(true);
            setError(null);

            try {
                const currentUserResponse = await axiosInstance.get("/users/current-user-info");
                const vetId = currentUserResponse.data.id;

                const doctorPetsResponse = await axiosInstance.get(`/pets/doctor-pets/${vetId}`);
                setDoctorPets(doctorPetsResponse.data);
            } catch (error) {
                console.error("Error fetching wards:", error);
                setError("Failed to fetch wards. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchWards();
    }, [token, axiosInstance]);

    const handleViewPetProfile = (petId) => {
        navigate(`/pet/${petId}`);
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
            <div className="container mt-1">
                <div className="bg-table element-space wards" style={{ flex: 1, margin: "10px" }}>
                    <h2 className="table-appointment">My Wards</h2>
                    {doctorPets.length > 0 ? (
                        <table cellPadding="0" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {doctorPets.map((pet) => (
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
                                        {"\t"}
                                        <strong>{pet.name}</strong> {" "} {"\t"}
                                        ({pet.type}, {" "}
                                        {pet.age} y.o. {" "}
                                        {pet.sex})
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="button btn-no-border rounded-3"
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
                        <p>No pets assigned to this vet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyWards;