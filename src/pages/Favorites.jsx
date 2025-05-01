import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [visibleInstructions, setVisibleInstructions] = useState({});

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFavorite = (recipe) => {
    const updatedFavorites = favorites.filter((item) => item.name !== recipe.name);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success(`${recipe.name} removed from favorites.`);
  };

  const toggleInstructions = (index) => {
    setVisibleInstructions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>❤️ Favorite Recipes</h2>
      <div style={favoritesGrid}>
        {favorites.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#fff" }}>
            You have no favorites yet. Add some recipes to your favorites.
          </p>
        ) : (
          favorites.map((recipe, index) => (
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

              <button
                style={removeBtn}
                onClick={() => handleRemoveFavorite(recipe)}
              >
                <FaTrashAlt /> Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Styles
const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(to right, #ff8c00, #ffb347)",
  color: "#fff",
};

const favoritesGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "center",
};

const cardStyle = {
  width: "260px",
  backgroundColor: "#ffffffdd",
  padding: "15px",
  borderRadius: "10px",
  color: "#333",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const imgStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "6px",
  marginBottom: "10px",
};

const toggleBtn = {
  marginTop: "10px",
  padding: "6px 10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const removeBtn = {
  marginTop: "10px",
  padding: "8px 12px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};
