import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, ChefHat, Bookmark, Share2, Flame } from 'lucide-react';
import { useRecipes } from "../../context/RecipeContext";
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const { toggleSave, toggleUpvote } = useRecipes();

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: recipe.title,
        text: `Check out this ${recipe.title} recipe on Recipin!`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(`Check out ${recipe.title}!`);
      alert('Recipe link copied to clipboard!');
    }
  };

  return (
    <div className="recipe-card glass-card">
      <div className="recipe-image-container">
        <Link to={`/recipe/${recipe.id}`}>
          <img src={recipe.image} alt={recipe.title} className="recipe-image" loading="lazy" />
        </Link>
        <div className="recipe-badges">
          <span className="badge badge-difficulty">
            <Flame size={14} /> {recipe.difficulty}
          </span>
        </div>
        <button
          className={`action-btn save-btn ${recipe.isSaved ? 'active' : ''}`}
          onClick={() => toggleSave(recipe.id)}
          aria-label={recipe.isSaved ? "Remove from saved" : "Save recipe"}
        >
          <Bookmark size={20} className={recipe.isSaved ? "icon-filled" : ""} />
        </button>
      </div>

      <div className="recipe-content">
        <div className="recipe-header">
          <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="recipe-title">{recipe.title}</h3>
          </Link>
          <p className="recipe-author">by {recipe.author_name}</p>
        </div>

        <div className="recipe-stats">
          <div className="stat">
            <Clock size={16} />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="stat">
            <ChefHat size={16} />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <div className="recipe-footer flex-between">
          <button
            className="upvote-btn flex-center"
            onClick={() => toggleUpvote(recipe.id)}
          >
            <Heart size={18} className="upvote-icon" />
            <span className="upvote-count">{recipe.upvotes}</span>
          </button>

          <button className="share-btn flex-center" onClick={handleShare} aria-label="Share recipe">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
