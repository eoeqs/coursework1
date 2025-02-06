import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const isAuthenticated = false; // TODO: нормально токен проверять

    const handleProfileClick = () => {
        if (isAuthenticated) {
            navigate("/profile"); // TODO: Adjust based on user role
        } else {
            navigate("/login");
        }
    };

    return (
        <header>
            <h1>VetCare</h1>
            <button onClick={handleProfileClick}>
                My profile
            </button>
        </header>
    );
}
