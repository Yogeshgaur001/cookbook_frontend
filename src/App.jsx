import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AddRecipe from "./pages/AddRecipe";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import MyRecipes from "./pages/MyRecipes"; // ✅ Make sure path is correct
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* ✅ Show Navbar only if logged in */}
      {localStorage.getItem("isLoggedIn") === "true" && <Navbar />}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Default to /auth for any unknown routes */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
