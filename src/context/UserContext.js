import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check local storage for token
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Decode token to get user data (you can use jwt-decode library)
            const userData = JSON.parse(atob(storedToken.split('.')[1]));
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' && e.newValue === null) {
                logout(); // Token removed (logout from another tab)
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return React.useContext(UserContext);
}; 