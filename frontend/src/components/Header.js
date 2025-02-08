import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const navigate = useNavigate();
    const isAuthenticated = false; // TODO: properly check token
    const [menuOpen, setMenuOpen] = useState(false);

    const handleProfileClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuItemClick = (path) => {
        setMenuOpen(false);
        if (path === "/profile" && !isAuthenticated) {
            navigate("/login");
        } else {
            navigate(path);
        }
    };

    return (
        <header className="flex justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">VetCare</h1>
            <div className="relative">
                <button onClick={handleProfileClick} className="bg-gray-700 px-4 py-2 rounded">
                    My profile
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg">
                        <button onClick={() => handleMenuItemClick("/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                            Profile
                        </button>
                        <button onClick={() => handleMenuItemClick("/notifications")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                            Notifications
                        </button>
                        <button onClick={() => handleMenuItemClick("/logout")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
