import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditVetByAdminModal from "./EditVetByAdminModal";
import EditRolesModal from "./EditRolesModal";

const AllVets = () => {
    const axiosInstance = useAxiosWithAuth();
    const [vets, setVets] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);

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
            <div className="container mt-3" style={{ padding: "20px" }}>
                <h2>All Veterinarians</h2>
                <div className="bg-table element-space" style={{ marginBottom: "20px" }}>
                    {vets.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {vets.map((vet) => (
                                <tr key={vet.id}>
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