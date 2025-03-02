import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditOwnerModal from "./EditOwnerModal";
import EditRolesModal from "./EditRolesModal";

const AllPetOwners = () => {
    const axiosInstance = useAxiosWithAuth();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);

    useEffect(() => {
        const fetchOwners = async () => {
            setLoading(true);
            setError(null);

            try {
                const ownersResponse = await axiosInstance.get("/users/all-owners");
                setOwners(ownersResponse.data);
            } catch (error) {
                console.error("Error fetching owners:", error);
                setError("Failed to fetch pet owners. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOwners();
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
            setOwners(owners.map((o) => (o.id === selectedUser.id ? response.data : o)));
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
            setOwners(owners.map((o) => (o.id === selectedUser.id ? response.data : o)));
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
                <h2>All Pet Owners</h2>
                <div className="bg-table element-space">
                    {owners.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="uniq-table">
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
                        <p>No owners found.</p>
                    )}
                </div>
            </div>

            {isEditUserModalOpen && (
                <EditOwnerModal
                    ownerInfo={selectedUser}
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

export default AllPetOwners;