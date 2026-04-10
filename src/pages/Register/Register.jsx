import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, UserPlus, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../Login/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
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

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok) {
            setError(data.error || 'Registration failed');
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
                    <h1 className="page-title">Join Recipin</h1>
                    <p className="page-subtitle">Create an account to save and share recipes</p>
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
                            placeholder="Choose a username"
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
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label flex-center-start gap-2">
                            <Lock size={16} /> Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input-field"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn mt-4" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : <><UserPlus size={20} /> Sign Up</>}
                    </button>
                </form>

                <p className="auth-footer text-center mt-6">
                    Already have an account? <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
