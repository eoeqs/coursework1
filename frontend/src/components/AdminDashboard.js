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
import EditPetModal from "./EditPetModal";
import CreateSlotModal from "./CreateSlotModal";

const AdminDashboard = () => {
    const axiosInstance = useAxiosWithAuth();
    const navigate = useNavigate();
    const [vets, setVets] = useState([]);
    const [owners, setOwners] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [pets, setPets] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
    const [isCreateClinicModalOpen, setIsCreateClinicModalOpen] = useState(false);
    const [isCreateSectorModalOpen, setIsCreateSectorModalOpen] = useState(false);
    const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
    const [isCreateSlotModalOpen, setIsCreateSlotModalOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const vetsResponse = await axiosInstance.get("/users/all-vets");
                setVets(vetsResponse.data);

                const ownersResponse = await axiosInstance.get("/users/all-owners");
                setOwners(ownersResponse.data);

                const clinicsResponse = await axiosInstance.get("/clinics/all");
                setClinics(clinicsResponse.data);

                const sectorsResponse = await axiosInstance.get("/sectors/all");
                setSectors(sectorsResponse.data);

                const petsResponse = await axiosInstance.get("/pets/all-pets");
                setPets(petsResponse.data);

                const slotsResponse = await axiosInstance.get("/slots/all");
                setSlots(slotsResponse.data);

                const userResponse = await axiosInstance.get("/users/current-user-info");
                setUserRole(userResponse.data.role);
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

    const openCreateSlotModal = () => {
        setIsCreateSlotModalOpen(true);
    };

    const closeCreateSlotModal = () => {
        setIsCreateSlotModalOpen(false);
    };

    const handleSaveUser = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/users/update-user-admin/${selectedUser.id}`, updatedData);
            if (selectedUser.roles.includes("ROLE_VET")) {
                setVets(vets.map((v) => (v.id === selectedUser.id ? response.data : v)));
            } else if (selectedUser.roles.includes("ROLE_OWNER")) {
                setOwners(owners.map((o) => (o.id === selectedUser.id ? response.data : o)));
            }
            closeEditUserModal();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleSaveRoles = async (newRole) => {
        try {
            const response = await axiosInstance.put(`/users/update-roles/${selectedUser.id}`, newRole, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data.roles.includes("ROLE_VET")) {
                setVets(vets.map((v) => (v.id === selectedUser.id ? response.data : v)));
            } else if (response.data.roles.includes("ROLE_OWNER")) {
                setOwners(owners.map((o) => (o.id === selectedUser.id ? response.data : o)));
            }
            closeEditRolesModal();
        } catch (error) {
            console.error("Error updating roles:", error);
        }
    };

    const handleSaveClinic = async (clinicData) => {
        try {
            const response = await axiosInstance.post("/clinics/save", clinicData);
            setClinics([...clinics, response.data]);
            closeCreateClinicModal();
        } catch (error) {
            console.error("Error creating clinic:", error);
        }
    };

    const handleSaveSector = async (sectorData) => {
        try {
            const response = await axiosInstance.post("/sectors/new", sectorData);
            setSectors([...sectors, response.data]);
            closeCreateSectorModal();
        } catch (error) {
            console.error("Error creating sector:", error);
        }
    };

    const handleDeleteSector = async (sectorId) => {
        if (!window.confirm("Are you sure you want to delete this sector?")) return;

        try {
            await axiosInstance.delete(`/sectors/delete/${sectorId}`);
            setSectors(sectors.filter((sector) => sector.id !== sectorId));
        } catch (error) {
            console.error("Error deleting sector:", error);
        }
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

    const handleManageQuarantines = () => {
        navigate("/quarantine-management");
    };

    const handleSaveSlot = async (slotData) => {
        try {
            const response = await axiosInstance.post("/slots/add-slot", slotData);
            setSlots([...slots, response.data]);
            closeCreateSlotModal();
        } catch (error) {
            console.error("Error creating slot:", error);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm("Are you sure you want to delete this slot?")) return;

        try {
            await axiosInstance.delete(`/slots/delete-slot/${slotId}`);
            setSlots(slots.filter((slot) => slot.id !== slotId));
        } catch (error) {
            console.error("Error deleting slot:", error);
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
            <div className="container mt-3" style={{ padding: "20px", paddingTop: '90px'}}>
                <div style={{margin: '0px 10px 0px 30px'}}>
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
                <button
                    className="button rounded-3 btn-no-border"
                    onClick={openCreateSlotModal}
                    style={{ marginBottom: "20px", marginLeft: "10px" }}
                >
                    Create Slot
                </button>
                {(userRole === "ROLE_ADMIN" || userRole === "ROLE_VET") && (
                    <button
                        className="button rounded-3 btn-no-border"
                        onClick={handleManageQuarantines}
                        style={{ marginBottom: "20px", marginLeft: "10px" }}
                    >
                        Manage Quarantines
                    </button>
                )}
                </div>

                <h3  style={{margin: '10px 20px 10px 40px'}}>Sectors</h3>
                <div className="bg-admin element-space" style={{ marginBottom: "20px" }}>
                    {sectors.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="admin-table">
                            <thead>
                            <tr>
                                <th>Sector ID</th>
                                <th>Category</th>
                                <th>Capacity</th>
                                <th>Occupancy</th>
                                <th>Available</th>
                                <th></th>
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

                <h3 style={{margin: '10px 20px 10px 40px'}}>Pets</h3>
                <div className="bg-admin" style={{marginBottom: "20px"}}>
                    {pets.length > 0 ? (
                        <table cellPadding="0" cellSpacing="0" className="admin-table">
                            <thead>
                            <tr>
                                <th>Pet ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Breed</th>
                                <th>Age</th>
                                <th>Sex</th>
                                <th></th>
                            </tr>
                            </thead>
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
                                            onClick={() => handleViewPetProfile(pet.id)}>
                                            View
                                        </button>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditPetModal(pet)}
                                            style={{marginLeft: "0px"}}>
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

                <h3 style={{margin: '10px 20px 10px 40px'}}>Slots</h3>
                <div className="bg-admin element-space" style={{marginBottom: "20px"}}>
                    {slots.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="admin-table">
                            <thead>
                            <tr>
                                <th>Slot ID</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Vet ID</th>
                                <th>Priority</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {slots.map((slot) => (
                                <tr key={slot.id}>
                                    <td>{slot.id}</td>
                                    <td>{slot.date}</td>
                                    <td>{slot.startTime}-{slot.endTime}</td>
                                    <td>{slot.vetId}</td>
                                    <td>{slot.isPriority ? "Yes" : "No"}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => handleDeleteSlot(slot.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No slots found.</p>
                    )}
                </div>

                <h3 style={{margin: '10px 20px 10px 40px'}}>Veterinarians</h3>
                <div className="bg-admin element-space" style={{marginBottom: "20px"}}>
                    {vets.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="admin-table">
                            <thead>
                            <tr>
                                <th>Vet ID</th>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {vets.map((vet) => (
                                <tr key={vet.id}>
                                    <td>{vet.id}</td>
                                    <td>{vet.username}</td>
                                    <td>{vet.name} {vet.surname}</td>
                                    <td>{vet.email}</td>
                                    <td>{Array.isArray(vet.roles) ? vet.roles.join(", ") : vet.roles}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditUserModal(vet)}
                                        >
                                            Edit User
                                        </button>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditRolesModal(vet)}
                                            style={{marginLeft: "10px"}}
                                        >
                                            Edit Roles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No veterinarians found.</p>
                    )}
                </div>

                    <h3 style={{margin: '10px 20px 10px 40px'}}>Owners</h3>
                <div className="bg-admin element-space">
                    {owners.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="admin-table">
                            <thead>
                            <tr>
                                <th>Owner ID</th>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {owners.map((owner) => (
                                <tr key={owner.id}>
                                    <td>{owner.username}</td>
                                    <td>{owner.name} {owner.surname}</td>
                                    <td>{owner.email}</td>
                                    <td>{Array.isArray(owner.roles) ? owner.roles.join(", ") : owner.roles}</td>
                                    <td>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditUserModal(owner)}
                                        >
                                            Edit User
                                        </button>
                                        <button
                                            className="button btn-no-border"
                                            onClick={() => openEditRolesModal(owner)}
                                            style={{marginLeft: "10px"}}
                                        >
                                            Edit Roles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No owners found.</p>
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

            {isCreateSlotModalOpen && (
                <CreateSlotModal
                    onClose={closeCreateSlotModal}
                    onSave={handleSaveSlot}
                    vets={vets}
                />
            )}
        </div>
    );
};

export default AdminDashboard;