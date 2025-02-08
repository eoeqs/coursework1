import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import Header from "./Header";

export default function HomePage() {
    const navigate = useNavigate();
    const { token: authToken } = useAuth();
    const storedToken = localStorage.getItem("token");
    const token = authToken || storedToken;

    const handleAppointmentClick = () => {
        if (token) {
            navigate("/appointment");
        } else {
            navigate("/login", { state: { redirectTo: "/appointment" } });
        }
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
                </div>

                <div>
                    <h2>Meet Our Veterinarians</h2>
                    <div>
                        <div>
                            <h3>Dr. Dre</h3>
                            <p>Expert in yoyoyo</p>
                            <p>⭐⭐⭐⭐⭐</p>
                            <p>"Dr. Dre is amazing! Took great care of my dog."</p>
                        </div>
                        <div>
                            <h3>Dr. Ferg</h3>
                            <p>Expert in exotic animals and surgery.</p>
                            <p>⭐⭐⭐⭐⭐</p>
                            <p>"Very professional and kind. Highly recommend!"</p>
                        </div>
                        <div>
                            <h3>Dr. Eoqe</h3>
                            <p>Expert in sabakababaka.</p>
                            <p>⭐⭐⭐⭐⭐</p>
                            <p>"Helped my cat recover quickly. Thank you!"</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2>Contact Information</h2>
                    <p>Address: 10 Veterinary Street, Moscow</p>
                    <p>Phone: +7 (123) 456-78-90</p>
                    <p>Email: contact@vetcare.ru</p>
                </div>
            </div>
        </div>
    );
}
