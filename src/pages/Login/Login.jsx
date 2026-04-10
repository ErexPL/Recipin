import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, LogIn, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok) {
            setError(data.error || 'Login failed');
            return;
        }

        login(data.user, data.token);
        navigate('/');
    };

    return (
        <div className="auth-container animate-fade-in flex-center">
            <div className="auth-card glass-panel">
                <div className="auth-header text-center">
                    <div className="empty-icon glass-card mx-auto mb-4">
                        <ChefHat size={40} color="var(--color-primary)" />
                    </div>
                    <h1 className="page-title">Welcome Back</h1>
                    <p className="page-subtitle">Login to access your recipes</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label flex-center-start gap-2">
                            <User size={16} /> Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="input-field"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label flex-center-start gap-2">
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn mt-4" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : <><LogIn size={20} /> Login</>}
                    </button>
                </form>

                <p className="auth-footer text-center mt-6">
                    Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
