import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, ChefHat, Heart, Bookmark, Flame, ListOrdered, ShoppingBag } from 'lucide-react';
import './RecipeDetails.css';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { recipes, isLoading, toggleSave, toggleUpvote } = useRecipes();
    const { isAuthenticated } = useAuth();

    if (isLoading) {
        return (
            <div className="flex-center" style={{ height: '60vh' }}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    const recipe = recipes.find(r => r.id === parseInt(id));

    if (!recipe) {
        return (
            <div className="flex-center flex-column" style={{ height: '60vh' }}>
                <h2>Recipe Not Found</h2>
                <button className="btn btn-outline mt-4" onClick={() => navigate('/')}>Return to Discover</button>
            </div>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: recipe.title,
                text: `Check out this ${recipe.title} recipe on Recipin!`,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('Recipe link copied to clipboard!');
        }
    };

    return (
        <div className="recipe-details-container animate-fade-in">
            <button className="btn-icon back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <ArrowLeft size={24} />
            </button>

            <div className="recipe-details-header">
                <div className="img-wrapper glass-panel">
                    <img src={recipe.image} alt={recipe.title} className="detail-img" />
                    <div className="badges-overlay">
                        <span className="badge badge-difficulty">
                            <Flame size={16} /> {recipe.difficulty}
                        </span>
                        <span className="badge badge-time">
                            <Clock size={16} /> {recipe.prepTime}
                        </span>
                    </div>
                </div>

                <div className="detail-meta glass-panel mt-6">
                    <div className="flex-between">
                        <h1 className="detail-title">{recipe.title}</h1>
                        <div className="detail-actions flex-center gap-2">
                            <button
                                className={`action-btn save-btn ${recipe.isSaved ? 'active' : ''}`}
                                onClick={() => toggleSave(recipe.id)}
                                title={isAuthenticated ? (recipe.isSaved ? "Remove from saved" : "Save recipe") : "Login to save"}
                            >
                                <Bookmark size={24} className={recipe.isSaved ? "icon-filled" : ""} />
                            </button>
                            <button
                                className="action-btn upvote-btn flex-center gap-2"
                                onClick={() => toggleUpvote(recipe.id)}
                                title={isAuthenticated ? "Upvote recipe" : "Login to upvote"}
                            >
                                <Heart size={24} className={recipe.hasUpvoted ? "icon-filled" : ""} />
                                <span className="text-lg font-bold">{recipe.upvotes}</span>
                            </button>
                        </div>
                    </div>
                    <p className="detail-author mt-2">Crafted by <strong>{recipe.author_name || recipe.author}</strong></p>
                </div>
            </div>

            <div className="detail-grid mt-6">
                <div className="ingredients-section glass-panel">
                    <h2 className="section-title flex-center-start gap-2">
                        <ShoppingBag size={24} color="var(--color-primary)" />
                        Ingredients
                    </h2>
                    <ul className="ingredients-list mt-4">
                        {recipe.ingredients && recipe.ingredients.map((ing, i) => (
                            <li key={i} className="ingredient-item">
                                <span className="bullet"></span>
                                {ing}
                            </li>
                        ))}
                        {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                            <p className="text-muted">No ingredients listed.</p>
                        )}
                    </ul>
                </div>

                <div className="steps-section glass-panel">
                    <h2 className="section-title flex-center-start gap-2">
                        <ListOrdered size={24} color="var(--color-primary)" />
                        Instructions
                    </h2>
                    <ol className="steps-list mt-4">
                        {recipe.steps && recipe.steps.map((step, i) => (
                            <li key={i} className="step-item">
                                <div className="step-number">{i + 1}</div>
                                <div className="step-content">{step}</div>
                            </li>
                        ))}
                        {(!recipe.steps || recipe.steps.length === 0) && (
                            <p className="text-muted">No instructions provided.</p>
                        )}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
