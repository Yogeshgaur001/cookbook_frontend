import { useState, useEffect } from "react";
import { Modal, Input, Dropdown, Menu, Spin, Tooltip } from "antd";
import RecipeCard from "../components/RecipeCard";
import { FaHeart,FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Spaghetti Bolognese",
      thumbnail: "https://via.placeholder.com/300",
      postedBy: "John Doe",
    },
    {
      id: 2,
      name: "Chicken Curry",
      thumbnail: "https://via.placeholder.com/300",
      postedBy: "Jane Smith",
    },
    {
      id: 3,
      name: "Vegetable Stir Fry",
      thumbnail: "https://via.placeholder.com/300",
      postedBy: "Alice Johnson",
    },
  ]);
  const [search, setSearch] = useState("");
  const [mySuggestions, setMySuggestions] = useState([]);
  const [forkifySuggestions, setForkifySuggestions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [favLoading, setFavLoading] = useState({});


  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  // 🔎 Fetch recipe suggestions from Forkify API
  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://forkify-api.herokuapp.com/api/search?q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.recipes) {
            const titles = data.recipes.map((r) => ({
              title: r.title,
              image: r.image_url,
              recipe_id: r.recipe_id, // Include recipe_id for API call
            }));
            setForkifySuggestions(titles);
          }
        })
        .catch(() => setForkifySuggestions([]));
    } else {
      setForkifySuggestions([]);
    }
  }, [search]);

  // 🍽 Fetch user's recipes from backend (after login)
  useEffect(() => {
    const token = getCookie("token"); // Retrieve token from cookies
    if (!token) {
      console.error("No token found in cookies");
      return;
    }

    fetch("http://localhost:3000/recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched recipes:", data); // Log the fetched data
        if (Array.isArray(data)) {
          // Transform the API response to match the expected structure
          const transformedRecipes = data.map((recipe) => ({
            id: recipe.id,
            title: recipe.name, // Use `name` as `title`
            image: recipe.thumbnail || "https://via.placeholder.com/300", // Fallback to placeholder if `thumbnail` is empty
            postedBy: recipe.postedBy?.name || "Unknown", // Use `postedBy.name` or fallback to "Unknown"
            instructions: recipe.instructions, // Include additional fields if needed
            ingredients: recipe.ingredients, // Include additional fields if needed
          }));
          setRecipes(transformedRecipes); // Update the `recipes` state
        } else {
          setRecipes([]); // Fallback if data is not an array
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setRecipes([]); // Fallback in case of an error
      });
  }, []);

  // Filter user's recipes based on search input
  useEffect(() => {
    if (search.length > 2) {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title && // Ensure title exists
          recipe.title.toLowerCase().includes(search.toLowerCase())
      );
      setMySuggestions(filtered);
      setIsDropdownVisible(true);
    } else {
      setMySuggestions([]);
      setIsDropdownVisible(false);
    }
  }, [search, recipes]);

  // Handle recipe click to show modal
  const handleRecipeClick = (recipe) => {
    setIsLoading(true); // Show loading spinner
    setIsModalVisible(true);
    setSelectedRecipe(null); // Clear previous recipe details

    // Fetch recipe details from Forkify API
    if (recipe.recipe_id) {
      fetch(`https://forkify-api.herokuapp.com/api/get?rId=${recipe.recipe_id}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedRecipe(data.recipe); // Update selected recipe with API response
          setIsLoading(false); // Hide loading spinner
        })
        .catch(() => {
          setIsLoading(false); // Hide spinner even if there's an error
        });
    } else {
      // For user's recipes, directly set the recipe
      setSelectedRecipe(recipe);
      setIsLoading(false);
    }

    setIsDropdownVisible(false); // Close dropdown
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

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


  // Create dropdown menu for suggestions
  const menu = (
    <Menu>
      {mySuggestions.length > 0 && (
        <>
          <Menu.ItemGroup title="My Recipes">
            {mySuggestions.slice(0, 5).map((recipe, i) => (
              <Menu.Item key={`my-${i}`} onClick={() => handleRecipeClick(recipe)}>
                {recipe.title}
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        </>
      )}
      {forkifySuggestions.length > 0 && (
        <>
          <Menu.ItemGroup title="Forkify Recipes">
            {forkifySuggestions.slice(0, 5).map((recipe, i) => (
              <Menu.Item key={`forkify-${i}`} onClick={() => handleRecipeClick(recipe)}>
                {recipe.title}
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        </>
      )}
    </Menu>
  );

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/recipe.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "20px" }}>
        🍲 Recipe Finder
      </h1>

      <Dropdown
        overlay={menu}
        trigger={["click"]}
        visible={isDropdownVisible}
        onVisibleChange={(visible) => setIsDropdownVisible(visible)}
        overlayStyle={{ zIndex: 1000 }} // Ensure dropdown does not overlap cards
      >
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto 10px auto",
            display: "block",
            borderRadius: "8px",
            fontSize: "1rem",
          }}
        />
      </Dropdown>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          position: "relative",
          zIndex: 1, // Ensure cards are above other components
        }}
      >
       {/* {recipes.map((recipe, index) => {
          const transformedRecipe = {
            title: recipe.name || recipe.title, // Use `name` if `title` is missing
            image: recipe.thumbnail || recipe.image_url, // Use `thumbnail` if `image_url` is missing
            ...recipe, // Include other properties
          };

          console.log("Transformed Recipe:", transformedRecipe); // Log the transformed recipe

          if (transformedRecipe.title && transformedRecipe.image) {
            return <RecipeCard key={index} recipe={transformedRecipe} />;
          } else {
            console.error("Invalid recipe object:", recipe);
            return null; // Skip invalid objects
          }
        })}*/}

  {recipes.map((recipe, index) => {
  const transformedRecipe = {
    title: recipe.name || recipe.title,
    image: recipe.thumbnail || recipe.image_url,
    ...recipe,
  };

  if (transformedRecipe.title && transformedRecipe.image) {
    return (
      <div
        key={index}
        className="recipe-card"
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "12px",
          width: "260px",
          background: "#fff",
          position: "relative",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          cursor: "pointer",
        }}
        onClick={() => handleRecipeClick(transformedRecipe)}
      >
        <img
          src={transformedRecipe.image}
          alt={transformedRecipe.title}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        />
        <h3 style={{ color: "#333" }}>{transformedRecipe.title}</h3>
        <p style={{ color: "#555" }}>
          <strong>By:</strong> {transformedRecipe.postedBy}
        </p>
        {/* Heart icon in bottom right with tooltip */}
        <Tooltip title="Add to Favorites" placement="bottom">
          <button
            onClick={e => {
              e.stopPropagation();
              handleFavorite(transformedRecipe.id);
            }}
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
            disabled={favLoading[transformedRecipe.id]}
            className="heart-btn"
          >
            <FaRegHeart />
          </button>
        </Tooltip>
        <style>
          {`
            .recipe-card:hover {
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
    );
  } else {
    console.error("Invalid recipe object:", recipe);
    return null;
  }
})}
      </div>

      {/* Modal for recipe details */}
      <Modal
  title={null} // Remove the default title to customize the layout
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={null}
  width="900px" // Increase the width for a more spacious layout
  bodyStyle={{
    height: "550px", // Slightly taller modal for better content fit
    padding: "20px",
    display: "flex", // Use flexbox for horizontal layout
    flexDirection: "row", // Arrange content horizontally
    gap: "30px", // Add more spacing between sections
    backgroundColor: "#f7f7f7", // Light background for a clean look
    borderRadius: "10px", // Rounded corners for a modern design
  }}
>
  {isLoading ? (
    <div style={{ textAlign: "center", padding: "50px 0", width: "100%" }}>
      <Spin size="large" />
    </div>
  ) : (
    selectedRecipe && (
      <>
        {/* Left Section: Title and Image */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2
            style={{
              fontSize: "2rem", // Larger font size for the title
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
              color: "#333", // Darker color for better contrast
            }}
          >
            {selectedRecipe.title}
          </h2>
          <img
            src={selectedRecipe.image_url}
            alt={selectedRecipe.title}
            style={{
              width: "100%",
              maxWidth: "350px", // Slightly larger image
              height: "250px",
              objectFit: "cover",
              borderRadius: "10px", // Rounded corners for the image
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Softer shadow for a professional look
            }}
          />
        </div>

        {/* Right Section: Ingredients and Steps */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Ingredients Section */}
          <div>
            <h3 style={{ marginBottom: "10px", color: "#333", fontSize: "1.5rem", fontWeight: "bold" }}>
              Ingredients
            </h3>
            <div
              style={{
                maxHeight: "300px", // Limit the height of the ingredients section
                overflowY: "auto", // Enable scrolling for the ingredients section
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff", // White background for better readability
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              }}
            >
              <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                {selectedRecipe.ingredients.map((ingredient, i) => (
                  <li key={i} style={{ marginBottom: "8px", color: "#555", fontSize: "1rem" }}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps Section */}
          <div>
            <h3 style={{ marginTop: "20px", marginBottom: "10px", color: "#333", fontSize: "1.5rem", fontWeight: "bold" }}>
              Steps
            </h3>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                fontSize: "1rem",
              }}
            >
              <a
                href={selectedRecipe.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1890ff",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                View full recipe steps here
              </a>
            </p>
          </div>
        </div>
      </>
    )
  )}
</Modal>
    </div>
  );
}