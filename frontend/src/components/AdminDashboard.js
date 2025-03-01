import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditVetByAdminModal from "./EditVetByAdminModal";
import EditOwnerModal from "./EditOwnerModal";
import EditUserModal from "./EditUserModal";
import EditRolesModal from "./EditRolesModal";
import CreateClinicModal from "./CreateClinicModal";
import CreateSectorModal from "./CreateSectorModal";
import EditPetModal from "./EditPetModal"; // Import EditPetModal

const AdminDashboard = () => {
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
    const [isCreateClinicModalOpen, setIsCreateClinicModalOpen] = useState(false);
    const [isCreateSectorModalOpen, setIsCreateSectorModalOpen] = useState(false);
    const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const usersResponse = await axiosInstance.get("/users/get-users");
                setUsers(usersResponse.data);

                const clinicsResponse = await axiosInstance.get("/clinics/all");
                setClinics(clinicsResponse.data);

                const sectorsResponse = await axiosInstance.get("/sectors/all");
                setSectors(sectorsResponse.data);

                const petsResponse = await axiosInstance.get("/pets/all-pets");
                setPets(petsResponse.data);
                console.log("Pets:", petsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance]);

    const openEditUserModal = (user) => {
        setSelectedUser(user);
        setIsEditUserModalOpen(true);
    };

    const closeEditUserModal = () => {
        setIsEditUserModalOpen(false);
        setSelectedUser(null);
    };

    const openEditRolesModal = (user) => {
        setSelectedUser(user);
        setIsEditRolesModalOpen(true);
    };

    const closeEditRolesModal = () => {
        setIsEditRolesModalOpen(false);
        setSelectedUser(null);
    };

    const openCreateClinicModal = () => {
        setIsCreateClinicModalOpen(true);
    };

    const closeCreateClinicModal = () => {
        setIsCreateClinicModalOpen(false);
    };

    const openCreateSectorModal = () => {
        setIsCreateSectorModalOpen(true);
    };

    const closeCreateSectorModal = () => {
        setIsCreateSectorModalOpen(false);
    };

    const openEditPetModal = (pet) => {
        setSelectedPet(pet);
        setIsEditPetModalOpen(true);
    };

    const closeEditPetModal = () => {
        setIsEditPetModalOpen(false);
        setSelectedPet(null);
    };

    const handleSaveUser = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/users/update-user-admin/${selectedUser.id}`, updatedData);
            setUsers(users.map((u) => (u.id === selectedUser.id ? response.data : u)));
            alert("User updated successfully!");
            closeEditUserModal();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    const handleSaveRoles = async (newRole) => {
        try {
            const response = await axiosInstance.put(`/users/update-roles/${selectedUser.id}`, newRole, {
                headers: { "Content-Type": "application/json" },
            });
            setUsers(users.map((u) => (u.id === selectedUser.id ? response.data : u)));
            alert("Roles updated successfully!");
            closeEditRolesModal();
        } catch (error) {
            console.error("Error updating roles:", error);
            alert("Failed to update roles.");
        }
    };

    const handleSaveClinic = async (clinicData) => {
        try {
            const response = await axiosInstance.post("/clinics/save", clinicData);
            setClinics([...clinics, response.data]);
            alert("Clinic created successfully!");
            closeCreateClinicModal();
        } catch (error) {
            console.error("Error creating clinic:", error);
            alert("Failed to create clinic.");
        }
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
                <h2>Admin Dashboard</h2>
                <button
                    className="button rounded-3 btn-no-border"
                    onClick={openCreateClinicModal}
                    style={{ marginBottom: "10px" }}
                >
                    Create Clinic
                </button>
                <button
                    className="button rounded-3 btn-no-border"
                    onClick={openCreateSectorModal}
                    style={{ marginBottom: "20px", marginLeft: "10px" }}
                >
                    Create Sector
                </button>

                <h3>Sectors</h3>
                <div className="bg-table element-space" style={{ marginBottom: "20px" }}>
                    {sectors.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">

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

                <h3>Pets</h3>
                <div className="bg-table element-space" style={{ marginBottom: "20px" }}>
                    {pets.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">

                            <tbody>
                            {pets.map((pet) => (
                                <tr key={pet.id}>
                                    <td>{pet.id}</td>
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

                <h3>Users</h3>
                <div className="bg-table element-space">
                    {users.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">

                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.name} {user.surname}</td>
                                    <td>{user.email}</td>
                                    <td>{Array.from(user.roles).join(", ")}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditUserModal(user)}
                                        >
                                            Edit User
                                        </button>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditRolesModal(user)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Edit Roles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            </div>

            {isEditUserModalOpen && (
                <>
                    {selectedUser.roles.includes("ROLE_VET") ? (
                        <EditVetByAdminModal
                            vetInfo={selectedUser}
                            clinics={clinics}
                            onClose={closeEditUserModal}
                            onSave={handleSaveUser}
                        />
                    ) : selectedUser.roles.includes("ROLE_OWNER") ? (
                        <EditOwnerModal
                            ownerInfo={selectedUser}
                            onClose={closeEditUserModal}
                            onSave={handleSaveUser}
                        />
                    ) : (
                        <EditUserModal
                            user={selectedUser}
                            clinics={clinics}
                            onClose={closeEditUserModal}
                            onSave={handleSaveUser}
                        />
                    )}
                </>
            )}

            {isEditRolesModalOpen && (
                <EditRolesModal
                    user={selectedUser}
                    onClose={closeEditRolesModal}
                    onSave={handleSaveRoles}
                />
            )}

            {isCreateClinicModalOpen && (
                <CreateClinicModal
                    onClose={closeCreateClinicModal}
                    onSave={handleSaveClinic}
                />
            )}

            {isCreateSectorModalOpen && (
                <CreateSectorModal
                    onClose={closeCreateSectorModal}
                    onSave={handleSaveSector}
                />
            )}

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

export default AdminDashboard;