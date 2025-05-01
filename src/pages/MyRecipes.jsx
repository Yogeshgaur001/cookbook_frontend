import React, { useEffect, useState } from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [visibleInstructions, setVisibleInstructions] = useState({});

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    setRecipes(storedRecipes);

    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const ids = favs.map((r) => r.name);
    setFavIds(ids);
  }, []);

  const handleAddToFavorites = (recipe) => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favs.find((r) => r.name === recipe.name);
    if (exists) {
      toast.info("Already in favorites!");
    } else {
      favs.push(recipe);
      localStorage.setItem("favorites", JSON.stringify(favs));
      setFavIds((prev) => [...prev, recipe.name]);
      toast.success("Added to favorites!");
    }
  };

  const handleRemoveRecipe = (recipeName) => {
    const updatedRecipes = recipes.filter((r) => r.name !== recipeName);
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    toast.success("Recipe removed!");
  };

  const toggleInstructions = (index) => {
    setVisibleInstructions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#fff", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🍽️ My Recipes</h2>
      <div style={recipeGrid}>
        {recipes.length === 0 ? (
          <p>No recipes found. Add some!</p>
        ) : (
          recipes.map((recipe, index) => (
            <div key={index} style={cardStyle}>
              <img src={recipe.thumbnail} alt={recipe.name} style={imgStyle} />
              <h3>{recipe.name}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>

              <button onClick={() => toggleInstructions(index)} style={toggleBtn}>
                {visibleInstructions[index] ? "Hide Instructions" : "Show Instructions"}
              </button>

              {visibleInstructions[index] && (
                <div
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  style={{ marginTop: "10px" }}
                />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button
                  onClick={() => handleAddToFavorites(recipe)}
                  style={{
                    ...favBtn,
                    background: favIds.includes(recipe.name)
                      ? "linear-gradient(to right, #28a745, #218838)"
                      : "linear-gradient(to right, #ff9800, #f57c00)",
                  }}
                >
                  <FaHeart />
                  {favIds.includes(recipe.name) ? "Favorited" : "Add to Favorites"}
                </button>

                <button onClick={() => handleRemoveRecipe(recipe.name)} style={removeBtn}>
                  <FaTrashAlt /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const recipeGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "center",
};

const cardStyle = {
  width: "260px",
  border: "1px solid #ddd",
  padding: "12px",
  borderRadius: "10px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
};

const imgStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "6px",
  marginBottom: "10px",
};

const favBtn = {
  flex: 1,
  padding: "8px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  justifyContent: "center",
};

const removeBtn = {
  flex: 1,
  padding: "8px",
  marginLeft: "10px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  justifyContent: "center",
};

const toggleBtn = {
  marginTop: "8px",
  padding: "6px 10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
