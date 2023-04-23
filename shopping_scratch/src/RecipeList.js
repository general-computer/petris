// RecipeList.js
import React from 'react';

function RecipeList({ recipes, onAddToCart }) {
  const handleAddToCart = (ingredients) => {
    ingredients.forEach((ingredient) => onAddToCart(ingredient));
  };

  return (
    <div className="RecipeList">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="Recipe">
          <img src={recipe.image} alt={recipe.title} />
          <h2>{recipe.title}</h2>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
          <button onClick={() => handleAddToCart(recipe.ingredients)}>
            Add ingredients to cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
