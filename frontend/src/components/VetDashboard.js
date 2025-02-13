import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import useAxiosWithAuth from "../AxiosAuth";

const VetDashboard = () => {
    const { token } = useAuth();
    const axiosInstance = useAxiosWithAuth();
    const [vetInfo, setVetInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        axiosInstance.get("/users/current-user-info")
            .then(response => {
                const fetchedVetId = response.data.id;

                return axiosInstance.get(`/users/user-info/${fetchedVetId}`);
            })
            .then(response => {
                setVetInfo(response.data);

                return axiosInstance.get(`/appointments/vet-appointments/${response.data.id}`);
            })
            .then(response => {
                const appointmentPromises = response.data.map(appointment => {
                    return Promise.all([
                        axiosInstance.get(`/slots/${appointment.slotId}`),
                        axiosInstance.get(`/pets/pet/${appointment.petId}`)
                    ]).then(([slotResponse, petResponse]) => {

                        return {
                            ...appointment,
                            slot: slotResponse.data,
                            pet: petResponse.data
                        };
                    });
                });

                return Promise.all(appointmentPromises);
            })
            .then(appointmentsWithDetails => {
                setAppointments(appointmentsWithDetails);
            })
            .catch(error => {
                console.error("Error fetching vet data or appointments:", error);
                setError("Failed to fetch data. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, axiosInstance]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!vetInfo) {
        return <div>No vet information found.</div>;
    }

    return (
        <div>
            <div>
                <div>
                    Vet profile pic placeholder
                </div>
                <div>
                    <h2>{vetInfo.name} {vetInfo.surname}</h2>
                    <p><strong>Qualification:</strong> {vetInfo.qualification || "Not specified"}</p>
                    <p><strong>Email:</strong> {vetInfo.email || "Not specified"}</p>
                    <p><strong>Phone:</strong> {vetInfo.phoneNumber || "Not specified"}</p>
                    <p><strong>Working hours:</strong> {vetInfo.workingHours || "Not specified"}</p>
                </div>
            </div>

            <div>
                <h2>Upcoming Appointments</h2>
                {appointments.length > 0 ? (
                    <table border="1" cellPadding="10" cellSpacing="0">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Pet Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.slot.date}</td>
                                <td>{appointment.slot.startTime} - {appointment.slot.endTime}</td>
                                <td>{appointment.pet.name}</td>
                                <td>
                                    <button onClick={() => handleView(appointment.id)}>View</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming appointments.</p>
                )}
            </div>
        </div>
    );

    const handleView = (appointmentId) => {
        console.log("View appointment with ID:", appointmentId);
    };
};

export default VetDashboard;