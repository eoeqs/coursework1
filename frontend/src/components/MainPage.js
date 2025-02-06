import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function HomePage() {
    const navigate = useNavigate();

    const handleAppointmentClick = () => {
        navigate("/login", { state: { redirectTo: "/appointment" } });
    };

    return (
        <div>
            <Header />
            <div>
                <div>
                    <h1>Welcome to VetCare</h1>
                    <p>
                        VetCare is a modern service for booking veterinary appointments, managing pet health, and receiving online medical care.
                    </p>
                    <p>We offer convenient appointment scheduling, access to your pet's medical history, and clinic news.</p>
                    <button onClick={handleAppointmentClick}>
                        Book an Appointment
                    </button>
                    <div>
                        <h2>Contact Information</h2>
                        <p>Address: 10 Veterinary Street, Moscow</p>
                        <p>Phone: +7 (123) 456-78-90</p>
                        <p>Email: contact@vetcare.ru</p>
                    </div>
                    <div>
                        <h2>Frequently Asked Questions (FAQ)</h2>
                        <ul>
                            <li>How do I book an appointment?</li>
                            <li>How can I access my pet’s medical history?</li>
                            <li>What services does the clinic offer?</li>
                        </ul>
                    </div>
                    <div>
                        <h2>News and Promotions</h2>
                        <p>Get a 10% discount on your first appointment until the end of the month!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
