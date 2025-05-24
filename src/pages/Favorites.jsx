import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt, FaHeart } from "react-icons/fa";
import axios from "axios";

// Helper to get token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [visibleInstructions, setVisibleInstructions] = useState({});

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = getCookie("token");
      try {
        const res = await axios.get("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // The backend returns an array of Favorite objects with a .recipe property
        setFavorites(res.data.map(fav => fav.recipe));
      } catch (err) {
        toast.error("Failed to fetch favorites.");
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (recipe) => {
    const token = getCookie("token");
    try {
      await axios.delete(`http://localhost:3000/favorites/${recipe.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((item) => item.id !== recipe.id));
      toast.success(`${recipe.name} removed from favorites.`);
    } catch (err) {
      toast.error("Failed to remove favorite.");
    }
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
            <div key={recipe.id || index} style={cardStyle} className="fade-card">
              <img src={recipe.thumbnail} alt={recipe.name} style={imgStyle} className="hover-img" />
              <h3>{recipe.name}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>

              <button onClick={() => toggleInstructions(index)} style={toggleBtn} className="hover-btn">
                {visibleInstructions[index] ? "Hide Instructions" : "Show Instructions"}
              </button>

              {visibleInstructions[index] && (
                <div
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  className="fade-in-instructions"
                  style={{ marginTop: "10px" }}
                />
              )}

              <button
                style={removeBtn}
                onClick={() => handleRemoveFavorite(recipe)}
                className="hover-btn"
              >
                <FaTrashAlt /> Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Enhance UI via injected styles */}
      <style>{`
        .fade-card {
          animation: fadeIn 0.6s ease-in-out;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .fade-card:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .hover-img {
          transition: transform 0.3s ease;
        }
        .hover-img:hover {
          transform: scale(1.03);
        }
        .hover-btn {
          transition: all 0.2s ease-in-out;
        }
        .hover-btn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }
        .fade-in-instructions {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 600px) {
          .fade-card {
            width: 90% !important;
          }
        }
      `}</style>
    </div>
  );
}

// Styles
const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(to right, #ff8c00, #ffb347)",
  color: "#333",
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
