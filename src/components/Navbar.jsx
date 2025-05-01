import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaHeart, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check for login status

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("You have successfully logged out!");
    navigate("/auth"); // Redirect to login page after logout
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>
        <Link to="/home" style={linkStyle}>
          TastyTrove 🍴
        </Link>
      </div>

      <div style={navLinksStyle}>
        {isLoggedIn ? (
          <>
            <Link to="/home" style={linkStyle}>
              <FaHome /> Home
            </Link>
            <Link to="/add-recipe" style={linkStyle}>
              <FaPlus /> Add Recipe
            </Link>
            <Link to="/my-recipes" style={linkStyle}>
  <FaHome /> My Recipes
</Link>

            <Link to="/favorites" style={linkStyle}>
              <FaHeart /> Favorites
            </Link>
            <span onClick={handleLogout} style={linkStyle}>
              <FaSignOutAlt /> Logout
            </span>
          </>
        ) : (
          <Link to="/auth" style={linkStyle}>
            <FaSignInAlt /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

// Styles
const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "#ff8c00",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const logoStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
};

const navLinksStyle = {
  display: "flex",
  gap: "25px",
  alignItems: "center",
};

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1rem",
  cursor: "pointer",
};
