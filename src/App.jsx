import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { RecipeProvider } from './context/RecipeContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Saved from './pages/Saved';
import CreateRecipe from './pages/CreateRecipe';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetails from './pages/RecipeDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
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
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
