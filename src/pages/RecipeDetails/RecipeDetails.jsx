import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../../context/RecipeContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Clock, Heart, Bookmark, Flame, ListOrdered, ShoppingBag, Pencil, Trash2, X, Plus, Upload } from 'lucide-react';
import './RecipeDetails.css';

const Trash2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        <path d="M3 6h18"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { recipes, isLoading, toggleSave, toggleUpvote, updateRecipe, deleteRecipe } = useRecipes();
    const { user, isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

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

    const isOwner = user && recipe.author_id === user.id;

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/recipe/${recipe.id}`;
        if (navigator.share) {
            await navigator.share({
                title: recipe.title,
                text: `Check out this ${recipe.title} recipe on Recipin!`,
                url: shareUrl,
            });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert('Recipe link copied to clipboard!');
        }
    };

    const startEditing = () => {
        setEditForm({
            title: recipe.title,
            image: recipe.image,
            prepTime: recipe.prepTime,
            difficulty: recipe.difficulty,
        });
        setIngredients([...recipe.ingredients]);
        setSteps([...recipe.steps]);
        setImagePreview(recipe.image);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditForm(null);
        setImagePreview('');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === 'prepTime') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setEditForm({ ...editForm, [name]: numericValue });
        } else {
            setEditForm({ ...editForm, [name]: value });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setEditForm(prev => ({ ...prev, image: '' }));
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addIngredient = () => setIngredients([...ingredients, '']);
    const removeIngredient = (index) => {
        if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const addStep = () => setSteps([...steps, '']);
    const removeStep = (index) => {
        if (steps.length > 1) setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSaveEdit = async () => {
        const cleanedIngredients = ingredients.filter(i => i.trim() !== '');
        const cleanedSteps = steps.filter(s => s.trim() !== '');

        if (cleanedIngredients.length === 0 || cleanedSteps.length === 0) {
            alert("Please add at least one ingredient and one step.");
            return;
        }

        const success = await updateRecipe(recipe.id, {
            ...editForm,
            ingredients: cleanedIngredients,
            steps: cleanedSteps,
        });

        if (success) {
            setIsEditing(false);
            setEditForm(null);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            const success = await deleteRecipe(recipe.id);
            if (success) {
                navigate('/');
            }
        }
    };

    if (isEditing && editForm) {
        return (
            <div className="recipe-details-container animate-fade-in">
                <div className="edit-header flex-between mb-6">
                    <h1 className="page-title">Edit Recipe</h1>
                    <button className="btn-icon" onClick={cancelEditing}>
                        <X size={24} />
                    </button>
                </div>

                <form className="create-form glass-panel" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                    <div className="form-section">
                        <h2 className="section-title">The Basics</h2>

                        <div className="input-group">
                            <label className="input-label">Recipe Title</label>
                            <input
                                type="text"
                                name="title"
                                className="input-field"
                                value={editForm.title}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Photo</label>
                            {!imagePreview ? (
                                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={32} className="upload-icon" />
                                    <p>Click to upload a photo</p>
                                    <span className="upload-hint">PNG, JPG, or WEBP</span>
                                </div>
                            ) : (
                                <div className="image-preview mt-2">
                                    <img src={imagePreview} alt="Preview" />
                                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="grid-2-col">
                            <div className="input-group">
                                <label className="input-label">Time (minutes)</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    name="prepTime"
                                    className="input-field"
                                    value={editForm.prepTime}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Difficulty</label>
                                <select
                                    name="difficulty"
                                    className="input-field select-field"
                                    value={editForm.difficulty}
                                    onChange={handleEditChange}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Ingredients</h2>
                        {ingredients.map((ing, index) => (
                            <div key={index} className="array-input-row flex-center-start gap-2 mb-2">
                                <span className="row-number">{index + 1}.</span>
                                <input
                                    type="text"
                                    className="input-field flex-1"
                                    value={ing}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                />
                                <button type="button" className="btn-icon danger-icon" onClick={() => removeIngredient(index)} disabled={ingredients.length === 1}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline mt-2" onClick={addIngredient}>
                            <Plus size={16} /> Add Ingredient
                        </button>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Instructions</h2>
                        {steps.map((step, index) => (
                            <div key={index} className="array-input-row flex-start gap-2 mb-2">
                                <span className="row-number mt-3">{index + 1}.</span>
                                <textarea
                                    className="input-field flex-1 textarea-field"
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                />
                                <button type="button" className="btn-icon danger-icon mt-2" onClick={() => removeStep(index)} disabled={steps.length === 1}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline mt-2" onClick={addStep}>
                            <Plus size={16} /> Add Step
                        </button>
                    </div>

                    <div className="form-actions mt-8 text-center pt-8 border-t">
                        <button type="button" className="btn mr-4" onClick={cancelEditing}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="recipe-details-container animate-fade-in">
            <div className="detail-top-bar flex-between mb-4">
                <button className="btn-icon back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                    <ArrowLeft size={24} />
                </button>
                {isOwner && (
                    <div className="owner-actions flex-center gap-2">
                        <button className="btn btn-outline" onClick={startEditing}>
                            <Pencil size={18} /> Edit
                        </button>
                        <button className="btn danger-btn" onClick={handleDelete}>
                            <Trash2Icon /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="recipe-details-header">
                <div className="img-wrapper glass-panel">
                    <img src={recipe.image} alt={recipe.title} className="detail-img" />
                    <div className="badges-overlay">
                        <span className="badge badge-difficulty">
                            <Flame size={16} /> {recipe.difficulty}
                        </span>
                        <span className="badge badge-time">
                            <Clock size={16} /> {recipe.prepTime} min
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
                                className={`action-btn upvote-btn flex-center gap-2 ${recipe.hasUpvoted ? 'active' : ''}`}
                                onClick={() => toggleUpvote(recipe.id)}
                                title={isAuthenticated ? "Upvote recipe" : "Login to upvote"}
                            >
                                <Heart size={24} className={recipe.hasUpvoted ? 'icon-filled' : ''} />
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
