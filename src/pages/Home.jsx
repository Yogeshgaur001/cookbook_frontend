import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔎 Fetch recipe suggestions from Forkify API
  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://forkify-api.herokuapp.com/api/search?q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.recipes) {
            const titles = data.recipes.map((r) => r.title);
            setSuggestions(titles);
          }
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  // 🍽 Fetch user's recipes from backend (after login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
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

      <input
        type="text"
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
          border: "1px solid #ddd",
          fontSize: "1rem",
          color: "black",
        }}
      />

      {/* 🔽 Suggestion dropdown */}
      {suggestions.length > 0 && (
        <ul
          style={{
            maxWidth: "600px",
            margin: "0 auto 20px auto",
            background: "#fff",
            color: "#000",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {suggestions.slice(0, 5).map((item, i) => (
            <li key={i} style={{ padding: "6px 10px" }}>
              {item}
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {filtered.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
