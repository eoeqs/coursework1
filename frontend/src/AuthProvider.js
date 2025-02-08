import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const handleSetToken = (newToken) => {
        console.log("Setting token in AuthProvider:", newToken);
        setToken(newToken);
    };
    const logout = () => {
        setToken(null);
    };
    const value = {
        token,
        setToken: handleSetToken,
        logout,
    };

//TODO: сохранять токен в localstorage

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};