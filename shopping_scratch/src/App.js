// App.js
import './styles.css';
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import RecipeList from './RecipeList';
import Cart from './Cart';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const handleSearchResults = (results) => {
    setRecipes(results);
  };

  const handleAddToCart = (ingredient) => {
    setCartItems((prevItems) => [...prevItems, ingredient]);
  };

  return (
    <div className="App">
      <SearchBar onSearchResults={handleSearchResults} />
      <RecipeList recipes={recipes} onAddToCart={handleAddToCart} />
      <Cart cartItems={cartItems} />
    </div>
  );
}

export default App;
