import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Saved from '../pages/Saved/Saved';
import CreateRecipe from '../pages/CreateRecipe/CreateRecipe';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import RecipeDetails from '../pages/RecipeDetails/RecipeDetails';
import Navbar from '../components/Navbar/Navbar';

const AppRouter = () => {
  return (
    <Router>
      <div className="app-background"></div>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
