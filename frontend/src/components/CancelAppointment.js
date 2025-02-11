import React, { useState, useEffect } from "react";
import useAxiosWithAuth from "../AxiosAuth";

const CancelAppointment = () => {
    const axios = useAxiosWithAuth();
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("/appointments/all");
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setMessage("Error fetching appointments");
            }
        };
        fetchAppointments().then(r => console.log("fetched appointments. "));
    }, [axios]);

    const handleCancel = async () => {
        if (!selectedAppointment) {
            setMessage("Choose an appointment to cancel");
            return;
        }

        try {
            const response = await axios.delete(`/appointments/cancel-appointment/${selectedAppointment}`);
            setMessage(response.data);
            setAppointments(appointments.filter(app => app.id !== selectedAppointment));
        } catch (error) {
            setMessage("Error cancelling appointment: " + (error.response?.data || error.message));
        }
    };

    return (
        <div>
            <h2>Отмена записи</h2>
            <select value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)}>
                <option value="">Choose an appointment</option>
                {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                        {`Запись #${appointment.id} - ${appointment.date} ${appointment.time}`}
                    </option>
                ))}
            </select>
            <button onClick={handleCancel}>Cancel an appointment</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CancelAppointment;
