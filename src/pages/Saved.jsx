import React, { useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';
import { Bookmark, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Feed.css';

const Saved = () => {
    const { recipes, setFilter } = useRecipes();

    useEffect(() => {
        setFilter('Saved');
    }, [setFilter]);

    return (
        <div className="page-container animate-fade-in">
            <header className="page-header mb-8">
                <h1 className="page-title flex-center-start gap-2">
                    <Bookmark size={32} color="var(--color-primary)" />
                    Your Cookbook
                </h1>
                <p className="page-subtitle">Recipes you've collected to try later</p>
            </header>

            {recipes.length > 0 ? (
                <div className="recipe-grid">
                    {recipes.map(recipe => (
                        <div key={recipe.id} className="grid-item">
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-panel">
                    <div className="empty-icon glass-card">
                        <Bookmark size={48} className="text-muted" />
                    </div>
                    <h2>Your cookbook is empty</h2>
                    <p className="text-muted text-center max-w-sm mb-6">
                        When you find a recipe you love, click the bookmark icon to save it here for easy access.
                    </p>
                    <Link to="/" className="btn btn-primary">
                        <ChefHat size={20} />
                        Discover Recipes
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Saved;
