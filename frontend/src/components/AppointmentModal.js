const AppointmentModal = ({ appointment, onClose }) => {
    if (!appointment) return null;

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
        }}>
            <h3>Appointment Details</h3>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Description:</strong> {appointment.description}</p>
            <p><strong>Priority:</strong> {appointment.priority ? "Yes" : "No"}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};
export default AppointmentModal;