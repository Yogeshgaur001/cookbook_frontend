import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export default function AddRecipe() {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState(""); // base64 or URL
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !thumbnail || !ingredients || !instructions) {
      toast.error("Please fill in all the fields before submitting.");
      return;
    }

    const recipeData = {
      name,
      thumbnail,
      ingredients,
      instructions,
    };

    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:3000/recipes", recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("🎉 Recipe added successfully!");

      // Clear form
      setName("");
      setThumbnail("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      toast.error("❌ Failed to add recipe.");
      console.error("Add Recipe Error:", error.response?.data || error.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/addrecipe.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
      }}
    >
      <ToastContainer />
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "30px" }}>
        📝 Add a New Recipe
      </h2>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe Name"
          style={inputStyle}
        />

        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="Thumbnail URL (or upload below)"
          style={inputStyle}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{
            marginBottom: "15px",
            color: "white",
          }}
        />

        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (comma separated)"
          style={inputStyle}
        />

        <label style={{ marginBottom: "10px", display: "block" }}>
          <strong>Instructions</strong>
        </label>
        <ReactQuill
          theme="snow"
          value={instructions}
          onChange={setInstructions}
          style={{
            backgroundColor: "white",
            color: "black",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#ff8c00",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Add Recipe
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "none",
  fontSize: "1rem",
};
