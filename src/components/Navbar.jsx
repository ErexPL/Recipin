import React from 'react';
import { ChefHat, Search, PlusCircle, Bookmark, Compass, LogOut, User } from 'lucide-react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { searchQuery, setSearchQuery } = useRecipes();
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isSearchPage = location.pathname === '/';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass-panel">
            <div className="container nav-content">
                <Link to="/" className="brand">
                    <ChefHat size={32} color="var(--color-primary)" />
                    <span className="brand-text">Recipin</span>
                </Link>

                {isSearchPage && (
                    <div className="search-bar">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Find a delicious recipe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}

                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Compass size={24} />
                        <span className="nav-label">Discover</span>
                    </NavLink>

                    {isAuthenticated ? (
                        <>
                            <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Bookmark size={24} />
                                <span className="nav-label">Saved</span>
                            </NavLink>
                            <NavLink to="/create" className="btn btn-primary create-btn">
                                <PlusCircle size={20} />
                                <span>Create</span>
                            </NavLink>
                            <div className="nav-item user-menu flex-center-start gap-2 ml-4">
                                <div className="flex-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                                    <User size={18} />
                                    <span className="nav-label" style={{ display: 'inline', fontSize: '0.875rem' }}>{user.username}</span>
                                </div>
                                <button onClick={handleLogout} className="btn-icon danger-icon" title="Logout" style={{ width: '2rem', height: '2rem' }}>
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-center gap-2 ml-2">
                            <NavLink to="/login" className="btn" style={{ fontWeight: 500 }}>
                                Login
                            </NavLink>
                            <NavLink to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
