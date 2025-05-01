export default function RecipeCard({ recipe }) {
    return (
      <div style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: "300px",
        padding: "15px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      }}>
        <img src={recipe.thumbnail} alt={recipe.name} style={{ width: "100%", borderRadius: "5px" }} />
        <h3>{recipe.name}</h3>
        <p><strong>By:</strong> {recipe.postedBy}</p>
        <button style={{
          backgroundColor: "#ff8c00",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer"
        }}>Add to Favorites</button>
      </div>
    );
  }
  