import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import Header from "./Header";
import EditOwnerModal from "./EditOwnerModal";
import EditRolesModal from "./EditRolesModal";
import PawStub from "../pics/paw.png";

const AllPetOwners = () => {
    const axiosInstance = useAxiosWithAuth();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredOwners = owners.filter((owner) => {
        const query = searchQuery.toLowerCase();
        return (
            owner.username.toLowerCase().includes(query) ||
            owner.email.toLowerCase().includes(query) ||
            owner.name.toLowerCase().includes(query) ||
            owner.surname.toLowerCase().includes(query)
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
            setOwners(owners.map((o) => (o.id === selectedUser.id ? response.data : o)));
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
            setOwners(owners.map((o) => (o.id === selectedUser.id ? response.data : o)));
            closeEditRolesModal();
        } catch (error) {
            console.error("Error updating roles:", error);
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
                <h2>All Pet Owners</h2>

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

                <div className="bg-entities element-space">
                    {filteredOwners.length > 0 ? (
                        <table cellPadding="5" cellSpacing="0" className="entities-table table-right-end">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Photo</th>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOwners.map((owner) => (
                                <tr key={owner.id}>
                                    <td>{owner.id}</td>
                                    <td>{owner.photoUrl ? (
                                        <img className="avatar"
                                             src={owner.photoUrl}
                                             alt={`${owner.name}'s avatar`}
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