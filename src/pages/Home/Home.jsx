import React, { useEffect } from 'react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useRecipes } from "../../context/RecipeContext";
import { Sparkles, UtensilsCrossed } from 'lucide-react';
import './Feed.css';

const Home = () => {
    const { recipes, filter, setFilter } = useRecipes();


    useEffect(() => {
        if (filter === 'Saved') {
            setFilter('All');
        }
    }, [filter, setFilter]);

    return (
        <div className="page-container animate-fade-in">
            <header className="page-header flex-between mb-8">
                <div>
                    <h1 className="page-title">Discover</h1>
                    <p className="page-subtitle">Find your next culinary masterpiece</p>
                </div>

                <div className="filter-pills">
                    <button
                        className={`pill-btn ${filter === 'All' ? 'active' : ''}`}
                        onClick={() => setFilter('All')}
                    >
                        <UtensilsCrossed size={16} /> All
                    </button>
                    <button
                        className={`pill-btn ${filter === 'Trending' ? 'active' : ''}`}
                        onClick={() => setFilter('Trending')}
                    >
                        <Sparkles size={16} /> Trending
                    </button>
                </div>
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
                        <UtensilsCrossed size={48} className="text-muted" />
                    </div>
                    <h2>No matching recipes found</h2>
                    <p className="text-muted text-center max-w-sm">
                        Try adjusting your search terms or filters to find what you're looking for, or create a new recipe!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
