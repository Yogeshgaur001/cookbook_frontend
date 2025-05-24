/*import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

// Helper to get token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [visibleInstructions, setVisibleInstructions] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = getCookie("token");
      if (!token) {
        toast.error("You must be logged in to view your recipes.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/recipes/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(res.data);
      } catch (err) {
        console.error(err); // Helpful for debugging
        toast.error("Failed to fetch your recipes.");
      }
    };
    fetchRecipes();
  }, []);

  const handleFavorite = async (recipeId) => {
    const token = getCookie("token");
    setFavLoading((prev) => ({ ...prev, [recipeId]: true }));
    try {
      await axios.post(
        `http://localhost:3000/favorites/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to favorites!");
    } catch (err) {
      toast.error("Failed to add to favorites.");
    } finally {
      setFavLoading((prev) => ({ ...prev, [recipeId]: false }));
    }
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Styling objects
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

const toggleBtn = {
  marginTop: "8px",
  padding: "6px 10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const favBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "red",
  fontSize: "1.5em",
  zIndex: 2,
};*/
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Tooltip } from "antd";

// Helper to get token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [visibleInstructions, setVisibleInstructions] = useState({});
  const [favLoading, setFavLoading] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = getCookie("token");
      if (!token) {
        toast.error("You must be logged in to view your recipes.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/recipes/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch your recipes.");
      }
    };
    fetchRecipes();
  }, []);

  const handleFavorite = async (recipeId) => {
    const token = getCookie("token");
    setFavLoading((prev) => ({ ...prev, [recipeId]: true }));
    try {
      await axios.post(
        `http://localhost:3000/favorites/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to favorites!");
    } catch (err) {
      toast.error("Failed to add to favorites.");
    } finally {
      setFavLoading((prev) => ({ ...prev, [recipeId]: false }));
    }
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
    <div key={recipe.id || index} style={cardStyle} className="my-recipe-card">
      <Tooltip title="Add to Favorites" placement="bottom">
        <button
          onClick={() => handleFavorite(recipe.id)}
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "none",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            color: "#ffb6c1",
            fontSize: "1.3em",
            zIndex: 2,
            transition: "transform 0.2s, color 0.2s",
            padding: "6px",
            boxShadow: "none",
          }}
          title="Add to Favorites"
          disabled={favLoading[recipe.id]}
          className="heart-btn"
        >
          <FaRegHeart />
        </button>
      </Tooltip>
      <img
        src={recipe.thumbnail || "https://via.placeholder.com/150"}
        alt={recipe.name || "Recipe"}
        style={imgStyle}
      />
      <h3>{recipe.name}</h3>
      <p>
        <strong>Ingredients:</strong>{" "}
        {Array.isArray(recipe.ingredients)
          ? recipe.ingredients.join(", ")
          : recipe.ingredients}
      </p>
      <button onClick={() => toggleInstructions(index)} style={toggleBtn}>
        {visibleInstructions[index] ? "Hide Instructions" : "Show Instructions"}
      </button>
      {visibleInstructions[index] && (
        <div
          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          style={{ marginTop: "10px" }}
        />
      )}
      <style>
        {`
          .my-recipe-card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .my-recipe-card:hover {
            transform: scale(1.04);
            box-shadow: 0 6px 24px rgba(255,182,193,0.18);
            z-index: 3;
          }
          @media (max-width: 600px) {
            .heart-btn {
              font-size: 1.7em !important;
              bottom: 8px !important;
              right: 8px !important;
            }
          }
          .heart-btn:hover {
            transform: scale(1.15);
            color: #ff69b4;
          }
        `}
      </style>
    </div>
  ))
)}
      </div>
    </div>
  );
}

// Styling objects
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
  position: "relative",
};

const imgStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "6px",
  marginBottom: "10px",
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

const favBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "red",
  fontSize: "1.5em",
  zIndex: 2,
};
