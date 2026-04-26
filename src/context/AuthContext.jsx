import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('recipin_token');
        const storedUser = localStorage.getItem('recipin_user');

        if (storedToken && storedUser && !isTokenExpired(storedToken)) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem('recipin_token');
            localStorage.removeItem('recipin_user');
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('recipin_token', authToken);
        localStorage.setItem('recipin_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('recipin_token');
        localStorage.removeItem('recipin_user');
    };

    const value = { user, token, login, logout, isAuthenticated: !!user };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
