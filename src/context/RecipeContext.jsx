import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecipeContext = createContext();

export const useRecipes = () => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipes must be used within a RecipeProvider');
    }
    return context;
};

export const RecipeProvider = ({ children }) => {
    const { token, isAuthenticated } = useAuth();

    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecipes = async () => {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/recipes', { headers });
        const data = await res.json();
        setRecipes(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRecipes();
    }, [isAuthenticated, token]);

    const toggleSave = async (id) => {
        if (!isAuthenticated) return alert('Please login to save recipes');

        const res = await fetch(`/api/recipes/${id}/save`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            setRecipes(prev =>
                prev.map(r => r.id === id ? { ...r, isSaved: data.isSaved } : r)
            );
        }
    };

    const toggleUpvote = async (id) => {
        if (!isAuthenticated) return alert('Please login to upvote recipes');

        const res = await fetch(`/api/recipes/${id}/upvote`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            setRecipes(prev =>
                prev.map(r => {
                    if (r.id === id) {
                        return {
                            ...r,
                            hasUpvoted: data.hasUpvoted,
                            upvotes: data.hasUpvoted ? r.upvotes + 1 : r.upvotes - 1
                        };
                    }
                    return r;
                })
            );
        }
    };

    const addRecipe = async (newRecipe) => {
        if (!isAuthenticated) return alert('Please login to share a recipe');

        const res = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newRecipe)
        });

        if (res.ok) {
            await fetchRecipes();
        } else {
            const errData = await res.json();
            alert(errData.error || 'Failed to create recipe');
        }
    };

    let filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filter === 'Saved') {
        filteredRecipes = filteredRecipes.filter(r => r.isSaved);
    } else if (filter === 'Trending') {
        filteredRecipes = [...filteredRecipes].sort((a, b) => b.upvotes - a.upvotes);
    }

    const value = {
        recipes: filteredRecipes,
        allRecipesCount: recipes.length,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        toggleSave,
        toggleUpvote,
        addRecipe,
        isLoading
    };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );
};
