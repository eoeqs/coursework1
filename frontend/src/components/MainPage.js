import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import Header from "./Header";
import myImage from '../pics/logo_min.png';

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
            <Header/>
            <div style={{flex: 1}}>
                <div className="main-container mt-2" style={{display: "flex", gap: "20px"}}>

                    <div className="bg-table centered-content" style={{position: "relative", flex: 1}}>
                        <div
                            style={{
                                position: "absolute",
                                left: 20,
                                top: 50,
                                bottom: 0,
                                width: "210px",
                                height: "210px",
                                backgroundImage: `url(${myImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        />
                        <h1 style={{marginBottom: '30px'}}>Welcome to VetCare!</h1>
                        <p style={{marginBottom: '15px', fontSize: "25px"}}>
                            VetCare is a modern service for booking veterinary appointments, managing pet health,
                            and
                            receiving online medical care.
                        </p>
                        <p style={{marginBottom: '20px', fontSize: "25px"}}>We offer convenient appointment
                            scheduling,
                            access to your pet's medical history, and clinic
                            news.</p>
                        <button style={{padding: "12px 30px", fontSize: "17px"}}
                                className="button btn-no-border rounded-4" onClick={handleAppointmentClick}>
                            <b>Book an Appointment</b>
                        </button>
                    </div>

                    <div className="bg-table element-space prem_diagnsosis" style={{flex: 1}}>
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

                        <div className="bg-table element-space prem_diagnsosis" style={{flex: 1}}>
                            <h2>Contact Information</h2>
                            <p>Address: 10 Veterinary Street, Moscow</p>
                            <p>Phone: +7 (123) 456-78-90</p>
                            <p>Email: contact@vetcare.ru</p>
                        </div>
                    </div>

                </div>

            </div>

            );
            }
