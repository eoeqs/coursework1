import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import NewPetForm from "./NewPetForm";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AppointmentPage = ({ onClose }) => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();

    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showNewPetForm, setShowNewPetForm] = useState(false);
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [petInfo, setPetInfo] = useState(null);
    const [complaintDescription, setComplaintDescription] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const [priority, setPriority] = useState(false);
    const [bodyMarker, setBodyMarker] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        if (!token) return;

        axiosInstance
            .get("/users/current-user-info")
            .then((response) => {
                const fetchedUserId = response.data.id;
                const fetchedUserRole = response.data.role;
                setUserId(fetchedUserId);
                setUserRole(fetchedUserRole);

                return axiosInstance.get(`/users/user-info/${fetchedUserId}`);
            })
            .then((response) => {
                setOwnerName(response.data.name);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
            });
    }, [token, axiosInstance]);

    useEffect(() => {
        if (!token || !userId || !userRole) return;

        if (userRole === "ROLE_OWNER") {
            axiosInstance
                .get("/pets/user-pets")
                .then((response) => setPets(response.data))
                .catch((error) => console.error("Error fetching user pets:", error));
        } else if (userRole === "ROLE_VET") {
            axiosInstance
                .get(`/pets/doctor-pets/${userId}`)
                .then((response) => setPets(response.data))
                .catch((error) => console.error("Error fetching doctor pets:", error));
        }
    }, [token, userId, userRole, axiosInstance]);

    useEffect(() => {
        if (!token) return;

        const fetchSlotsWithVetInfo = async () => {
            try {
                const slotsResponse = await axiosInstance.get("/slots/available-slots");
                const slotsData = slotsResponse.data;

                const dates = [...new Set(slotsData.map((slot) => slot.date))];
                setAvailableDates(dates);

                const vetIds = [...new Set(slotsData.map((slot) => slot.vetId))];
                const vetPromises = vetIds.map((vetId) =>
                    axiosInstance.get(`/users/user-info/${vetId}`)
                );
                const vetResponses = await Promise.all(vetPromises);

                const vetMap = vetResponses.reduce((acc, response) => {
                    const vet = response.data;
                    acc[vet.id] = `${vet.name} ${vet.surname}`;
                    return acc;
                }, {});

                const updatedSlots = slotsData.map((slot) => ({
                    ...slot,
                    vetName: vetMap[slot.vetId] || "Unknown Vet",
                }));

                setSlots(updatedSlots);
            } catch (error) {
                console.error("Error fetching slots or vet info:", error);
            }
        };

        fetchSlotsWithVetInfo();
    }, [token, axiosInstance]);

    useEffect(() => {
        if (!selectedPetId) return;

        axiosInstance
            .get(`/pets/pet/${selectedPetId}`)
            .then((response) => setPetInfo(response.data))
            .catch((error) => {
                console.error("Error fetching pet info:", error);
                setPetInfo(null);
            });
    }, [selectedPetId, axiosInstance]);

    const handlePetCreated = (newPet) => {
        setPets([...pets, newPet]);
        setSelectedPetId(newPet.id);
        setShowNewPetForm(false);
    };

    const handleBodyMark = (marker) => {
        setBodyMarker(marker);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            return;
        }

        try {
            const appointmentResponse = await axiosInstance.post("/appointments/new-appointment", {
                priority,
                slotId: parseInt(selectedSlotId),
                petId: parseInt(selectedPetId),
                description: complaintDescription,
            });
            if (bodyMarker) {
                await axiosInstance.post("/body-marker/save", {
                    positionX: bodyMarker.x,
                    positionY: bodyMarker.y,
                    bodyPart: bodyMarker.part,
                    pet: selectedPetId,
                    appointment: appointmentResponse.data.id,
                });
            }
            onClose();
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const dateString = date.toISOString().split("T")[0];
            if (availableDates.includes(dateString)) {
                return "available-date";
            }
        }
        return null;
    };

    const filteredSlots = selectedDate
        ? slots.filter((slot) => slot.date === selectedDate.toISOString().split("T")[0])
        : [];

    const modalOverlayStyles = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const modalStyles = {
        backgroundColor: "#fdf7f7",
        padding: "15px 40px 15px 40px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "1200px",
        maxWidth: "95%",
        height: "auto",
        maxHeight: "100vh",
        overflowY: "hidden",
    };

    const headerStyles = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px",
        textAlign: "center",
        borderBottom: "2px solid #f0f0f0",
    };

    const closeButtonStyles = {
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
    };

    const mainContentStyles = {
        display: "flex",
        gap: "20px",
        height: "calc(100% - 40px)",
    };

    const leftColumnStyles = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "55%",
        maxWidth: "800px",
    };

    const rightColumnStyles = {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "100%",
        maxWidth: "500px",
        marginTop: "20px",
        backgroundColor: "white",
        padding: "10px 50px 20px 50px",
        borderRadius: "10px"
    };

    const petSelectStyles = {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    };

    const petInfoAndMapStyles = {
        display: "flex",
        gap: "5px",
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "white"
    };

    const labelStyles = {
        fontSize: "12px",
        fontWeight: "bold",
    };

    const selectStyles = {
        padding: "5px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        fontSize: "12px",
        width: "150px",
    };

    const buttonStyles = {
        padding: "5px 10px",
        backgroundColor: "#af6969",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
    };

    const textareaStyles = {
        width: "100%",
        padding: "5px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        fontSize: "12px",
        height: "60px",
        marginTop: "10px",
    };

    const tableStyles = {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
        maxHeight: "150px",
        overflowY: "auto",
    };

    const footerStyles = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        marginTop: "10px",
    };

    const checkboxStyles = {
        marginLeft: "5px",
    };

    const submitButtonStyles = {
        padding: "6px 12px",
        backgroundColor: "#c16666",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
    };

    return (
        <div style={modalOverlayStyles}>
            <style>{`
                .react-calendar__tile--now {
                    background-color: #ffffff !important;
                    color: black !important;
                }
                .react-calendar__tile--now:hover {
                    background-color: #e5e6e4 !important;
                }
                .available-date {
                    background-color: #D3E4CD !important;
                    color: black !important;
                }
                .available-date:hover {
                    background-color: #A9CBA4 !important;
                }
                .react-calendar {
                    width: 380px; /* Меньший квадратный календарь */
                    height: 340px; /* Уменьшенная высота */
                    border: none;
                    font-size: 15px; /* Меньший шрифт */
                }
            `}</style>
            <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                {showNewPetForm && (
                    <NewPetForm
                        token={token}
                        onPetCreated={handlePetCreated}
                        onCancel={() => setShowNewPetForm(false)}
                    />
                )}

                <div style={headerStyles}>
                    <h2>Book an Appointment</h2>
                    <button onClick={onClose} style={closeButtonStyles}>
                        ×
                    </button>
                </div>

                <div style={mainContentStyles}>
                    <div style={leftColumnStyles}>
                        <div style={petSelectStyles}>
                            <label style={labelStyles}>Select a Pet:</label>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <select
                                    value={selectedPetId}
                                    onChange={(e) => setSelectedPetId(e.target.value)}
                                    style={selectStyles}
                                >
                                    <option value="">Select Pet</option>
                                    {pets.map((pet) => (
                                        <option key={pet.id} value={pet.id}>
                                            {pet.name}
                                        </option>
                                    ))}
                                </select>
                                {(userRole === "ROLE_OWNER" || userRole === "ROLE_USER") && (
                                    <button onClick={() => setShowNewPetForm(true)} style={buttonStyles}>
                                        Create New Pet
                                    </button>
                                )}
                            </div>
                        </div>

                        {selectedPetId && petInfo && (
                            <div style={petInfoAndMapStyles}>
                                <div>
                                    <h3>Pet</h3>
                                    <p><strong>Name:</strong> {petInfo.name}</p>
                                    <p><strong>Breed:</strong> {petInfo.breed}</p>
                                    <p><strong>Type:</strong> {petInfo.type}</p>
                                    <p><strong>Weight:</strong> {petInfo.weight} kg</p>
                                    <p><strong>Sex:</strong> {petInfo.sex}</p>
                                    <p><strong>Age:</strong> {petInfo.age} years</p>
                                </div>
                                <div style={{ width: "300px" }}>
                                    <p style={{marginLeft: "90px"}}>Mark the problem area:</p>
                                    {petInfo.type === "DOG" && <DogBodyMap onMark={handleBodyMark} />}
                                    {petInfo.type === "CAT" && <CatBodyMap onMark={handleBodyMark} />}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={rightColumnStyles}>
                        <div>
                            <h2 style={{marginLeft: "90px"}}>Select a Date</h2>
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                tileClassName={tileClassName}
                                minDate={new Date()}
                            />
                        </div>
                        <div>
                            {selectedDate ? (
                                <>
                                    <h2>Time Slots for {selectedDate.toLocaleDateString()}</h2>
                                    <table style={tableStyles}>
                                        <thead>
                                        <tr>
                                            <th>Time Slot</th>
                                            <th>Doctor</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredSlots.length > 0 ? (
                                            filteredSlots.map((slot) => (
                                                <tr
                                                    key={slot.id}
                                                    onClick={() => setSelectedSlotId(slot.id)}
                                                    style={{
                                                        backgroundColor: selectedSlotId === slot.id ? "#D3E4CD" : "white",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <td>{slot.startTime} - {slot.endTime}</td>
                                                    <td>{slot.vetName}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2">No available slots</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <p>Please select a date to view slots.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ width: "100%" }}>
                    <label style={labelStyles}>Complaints and Symptoms:</label>
                    <textarea
                        value={complaintDescription}
                        onChange={(e) => setComplaintDescription(e.target.value)}
                        placeholder="Describe the symptoms or complaint here..."
                        style={textareaStyles}
                    />
                </div>

                <div style={footerStyles}>
                    <label style={labelStyles}>
                        It is an emergency:
                        <input
                            type="checkbox"
                            checked={priority}
                            onChange={() => setPriority(!priority)}
                            style={checkboxStyles}
                        />
                    </label>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedPetId || !selectedSlotId}
                        style={submitButtonStyles}
                    >
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentPage;