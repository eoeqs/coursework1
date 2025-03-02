import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditVetByAdminModal from "./EditVetByAdminModal";
import EditRolesModal from "./EditRolesModal";
import PawStub from "../pics/paw.png";

const AllVets = () => {
    const axiosInstance = useAxiosWithAuth();
    const [vets, setVets] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const vetsResponse = await axiosInstance.get("/users/all-vets");
                setVets(vetsResponse.data);

                const clinicsResponse = await axiosInstance.get("/clinics/all");
                setClinics(clinicsResponse.data);
            } catch (error) {
                console.error("Error fetching vets:", error);
                setError("Failed to fetch veterinarians. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance]);

    // Фильтрация по поисковому запросу
    const filteredVets = vets.filter((vet) => {
        const query = searchQuery.toLowerCase();
        return (
            vet.username.toLowerCase().includes(query) ||
            vet.email.toLowerCase().includes(query) ||
            vet.name.toLowerCase().includes(query) ||
            vet.surname.toLowerCase().includes(query)
        );
    });

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

    const handleSaveUser = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/users/update-user-admin/${selectedUser.id}`, updatedData);
            setVets(vets.map((v) => (v.id === selectedUser.id ? response.data : v)));
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
            setVets(vets.map((v) => (v.id === selectedUser.id ? response.data : v)));
            alert("Roles updated successfully!");
            closeEditRolesModal();
        } catch (error) {
            console.error("Error updating roles:", error);
            alert("Failed to update roles.");
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
            <div className="entities_container" style={{ padding: "20px" }}>
                <h2>All Veterinarians</h2>

                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: "10px",
                            width: "100%",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                        }}
                    />
                </div>

                <div className="bg-entities element-space" style={{ marginBottom: "20px" }}>
                    {filteredVets.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="entities-table table-right-end">
                            <tbody>
                            {filteredVets.map((vet) => (
                                <tr key={vet.id}>
                                    <td>{vet.photoUrl ? (
                                        <img className="avatar"
                                             src={vet.photoUrl}
                                             alt={`${vet.name}'s avatar`}
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
            </div>

            {isEditUserModalOpen && (
                <EditVetByAdminModal
                    vetInfo={selectedUser}
                    clinics={clinics}
                    onClose={closeEditUserModal}
                    onSave={handleSaveUser}
                />
            )}

            {isEditRolesModalOpen && (
                <EditRolesModal
                    user={selectedUser}
                    onClose={closeEditRolesModal}
                    onSave={handleSaveRoles}
                />
            )}
        </div>
    );
};

export default AllVets;