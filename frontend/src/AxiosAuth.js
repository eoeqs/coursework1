import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvider';
import axios from "axios";

const useAxiosWithAuth = () => {
    const { token, logout } = useAuth();

    return useMemo(() => {
        const instance = axios.create({
            baseURL: "http://localhost:8080/api",
        });

        instance.interceptors.request.use(
            (config) => {
                console.log(token)
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        const currentTime = Date.now() / 1000;
                        console.log("Current Token:", token);

                        if (decoded.exp < currentTime) {
                            logout();
                            window.location.href = '/login';
                            return Promise.reject(new Error("Token expired"));
                        } else {
                            config.headers['Authorization'] = `Bearer ${token}`;
                            console.log("Authorization Header:", config.headers['Authorization']);

                        }
                    } catch (error) {
                        console.error("Error decoding token:", error);
                        logout();
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return instance;
    }, [token, logout]);
};

export default useAxiosWithAuth;
