import React from 'react';
import AppRouter from './router/routes';
import { RecipeProvider } from './context/RecipeContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RecipeProvider>
          <AppRouter />
        </RecipeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
