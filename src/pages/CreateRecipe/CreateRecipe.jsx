import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, Trash2, ChefHat, Type, Clock } from 'lucide-react';
import { useRecipes } from '../../context/RecipeContext';
import './CreateRecipe.css';

const CreateRecipe = () => {
    const { addRecipe } = useRecipes();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        prepTime: '',
        cookTime: '',
        difficulty: 'Easy',
        image: '',
    });

    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, value, setter, list) => {
        const newList = [...list];
        newList[index] = value;
        setter(newList);
    };

    const addArrayItem = (setter, list) => {
        setter([...list, '']);
    };

    const removeArrayItem = (index, setter, list) => {
        if (list.length > 1) {
            setter(list.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedIngredients = ingredients.filter(i => i.trim() !== '');
        const cleanedSteps = steps.filter(s => s.trim() !== '');

        if (cleanedIngredients.length === 0 || cleanedSteps.length === 0) {
            alert("Please add at least one ingredient and one step.");
            return;
        }

        const newRecipe = {
            ...formData,

            image: formData.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
            ingredients: cleanedIngredients,
            steps: cleanedSteps,
            servings: 2,
        };

        addRecipe(newRecipe);
        navigate('/');
    };

    return (
        <div className="page-container animate-fade-in max-w-3xl">
            <header className="page-header mb-8 text-center">
                <div className="empty-icon glass-card mx-auto mb-4">
                    <ChefHat size={40} color="var(--color-primary)" />
                </div>
                <h1 className="page-title">Share Your Recipe</h1>
                <p className="page-subtitle">Add your culinary creation to the community</p>
            </header>

            <form className="create-form glass-panel" onSubmit={handleSubmit}>

                <div className="form-section">
                    <h2 className="section-title">The Basics</h2>

                    <div className="input-group">
                        <label className="input-label flex-center-start gap-2">
                            <Type size={16} /> Recipe Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="e.g., Grandma's Apple Pie"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label flex-center-start gap-2">
                            <Camera size={16} /> Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            className="input-field"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image}
                            onChange={handleChange}
                        />
                        {formData.image && (
                            <div className="image-preview mt-2">
                                <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>

                    <div className="grid-2-col">
                        <div className="input-group">
                            <label className="input-label flex-center-start gap-2">
                                <Clock size={16} /> Total Time
                            </label>
                            <input
                                type="text"
                                name="prepTime"
                                className="input-field"
                                placeholder="e.g., 45 min"
                                value={formData.prepTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label flex-center-start gap-2">
                                Difficulty
                            </label>
                            <select
                                name="difficulty"
                                className="input-field select-field"
                                value={formData.difficulty}
                                onChange={handleChange}
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
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="array-input-row flex-center-start gap-2 mb-2">
                            <span className="row-number">{index + 1}.</span>
                            <input
                                type="text"
                                className="input-field flex-1"
                                placeholder="e.g., 2 cups all-purpose flour"
                                value={ingredient}
                                onChange={(e) => handleArrayChange(index, e.target.value, setIngredients, ingredients)}
                                required={index === 0}
                            />
                            <button
                                type="button"
                                className="btn-icon danger-icon"
                                onClick={() => removeArrayItem(index, setIngredients, ingredients)}
                                disabled={ingredients.length === 1}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-outline mt-2"
                        onClick={() => addArrayItem(setIngredients, ingredients)}
                    >
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
                                placeholder="Describe this step in detail..."
                                value={step}
                                onChange={(e) => handleArrayChange(index, e.target.value, setSteps, steps)}
                                required={index === 0}
                            />
                            <button
                                type="button"
                                className="btn-icon danger-icon mt-2"
                                onClick={() => removeArrayItem(index, setSteps, steps)}
                                disabled={steps.length === 1}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-outline mt-2"
                        onClick={() => addArrayItem(setSteps, steps)}
                    >
                        <Plus size={16} /> Add Step
                    </button>
                </div>

                <div className="form-actions mt-8 text-center pt-8 border-t">
                    <button type="button" className="btn mr-4" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-large">
                        Publish Recipe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;
