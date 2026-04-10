import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChefHat, Type, Clock } from 'lucide-react';
import { useRecipes } from '../../context/RecipeContext';
import './CreateRecipe.css';

const CreateRecipe = () => {
    const { addRecipe } = useRecipes();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        prepTime: '',
        difficulty: 'Easy',
        image: '',
    });

    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'prepTime') {
            setFormData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const updateArray = (setter, list, index, value) => {
        const newList = [...list];
        newList[index] = value;
        setter(newList);
    };

    const addArrayItem = (setter, list) => setter([...list, '']);
    const removeArrayItem = (setter, list, index) => list.length > 1 && setter(list.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedIngredients = ingredients.filter(i => i.trim());
        const cleanedSteps = steps.filter(s => s.trim());

        if (!cleanedIngredients.length || !cleanedSteps.length) {
            return alert("Please add at least one ingredient and one step.");
        }

        await addRecipe({
            ...formData,
            image: formData.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
            ingredients: cleanedIngredients,
            steps: cleanedSteps,
        });
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
                        <input type="text" name="title" className="input-field" placeholder="e.g., Grandma's Apple Pie" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="input-label flex-center-start gap-2">
                            <Type size={16} /> Image URL
                        </label>
                        <input type="url" name="image" className="input-field" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} />
                    </div>

                    <div className="grid-2-col">
                        <div className="input-group">
                            <label className="input-label flex-center-start gap-2">
                                <Clock size={16} /> Time (minutes)
                            </label>
                            <input type="text" inputMode="numeric" name="prepTime" className="input-field" placeholder="45" value={formData.prepTime} onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Difficulty</label>
                            <select name="difficulty" className="input-field select-field" value={formData.difficulty} onChange={handleChange}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Ingredients</h2>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="array-input-row flex-center-start gap-2 mb-2">
                            <span className="row-number">{i + 1}.</span>
                            <input type="text" className="input-field flex-1" placeholder="e.g., 2 cups flour" value={ing} onChange={(e) => updateArray(setIngredients, ingredients, i, e.target.value)} required={i === 0} />
                            <button type="button" className="btn-icon danger-icon" onClick={() => removeArrayItem(setIngredients, ingredients, i)} disabled={ingredients.length === 1}><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline mt-2" onClick={() => addArrayItem(setIngredients, ingredients)}><Plus size={16} /> Add Ingredient</button>
                </div>

                <div className="section-divider"></div>

                <div className="form-section">
                    <h2 className="section-title">Instructions</h2>
                    {steps.map((step, i) => (
                        <div key={i} className="array-input-row flex-start gap-2 mb-2">
                            <span className="row-number mt-3">{i + 1}.</span>
                            <textarea className="input-field flex-1 textarea-field" placeholder="Describe this step..." value={step} onChange={(e) => updateArray(setSteps, steps, i, e.target.value)} required={i === 0} />
                            <button type="button" className="btn-icon danger-icon mt-2" onClick={() => removeArrayItem(setSteps, steps, i)} disabled={steps.length === 1}><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline mt-2" onClick={() => addArrayItem(setSteps, steps)}><Plus size={16} /> Add Step</button>
                </div>

                <div className="form-actions mt-8 text-center pt-8 border-t">
                    <button type="button" className="btn mr-4" onClick={() => navigate('/')}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-large">Publish Recipe</button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;
