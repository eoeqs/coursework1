import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const decoded = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                localStorage.removeItem("token");
                setToken(null);
            } else {
                setToken(storedToken);
            }
        }
    }, []);

    const handleSetToken = (newToken) => {
        console.log("Setting token in AuthProvider:", newToken);
        setToken(newToken);
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const value = {
        token,
        setToken: handleSetToken,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
