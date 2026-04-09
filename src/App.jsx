import React from 'react';
import AppRouter from './router/routes';
import { RecipeProvider } from './context/RecipeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <AppRouter />
      </RecipeProvider>
    </AuthProvider>
  );
}

export default App;
