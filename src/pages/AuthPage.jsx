import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    toast.info("🔐 Please login or register to continue.");
  }, []);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      toast.error("❗ Please fill in all required fields.");
      return;
    }

    if (isLogin) {
      // Login the user
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Include credentials (cookies) in the request
        });

        const data = await response.json();
        console.log("response.ok", response.ok);
        

        if (response.ok) {
          console.log("inside if");
          
          toast.success("✅ Logged in successfully!");
          navigate("/home"); // Redirect to /home
        } else {
          toast.error(`❌ ${data.message || "Invalid email or password."}`);
        }
      } catch (error) {
        toast.error("❌ Something went wrong. Please try again.");
      }
    } else {
      // Register the user
      try {
        const response = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("🎉 Registered successfully!");
          setIsLogin(true); // Switch to login view
        } else {
          toast.error(`❌ ${data.message || "Registration failed."}`);
        }
      } catch (error) {
        toast.error("❌ Something went wrong. Please try again.");
      }
    }

    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(to right, #ff8c00, #ffb347)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <ToastContainer />
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          padding: "25px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "360px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
          {isLogin ? "🔐 Login" : "📝 Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            value={name}
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        )}

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <div style={{ position: "relative", marginBottom: "15px" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...inputStyle,
              paddingRight: "40px",
              marginBottom: 0,
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#333",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            ...inputStyle,
            backgroundColor: "#fff",
            color: "#ff8c00",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
          }}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          {isLogin ? (
            <>
              New user?{" "}
              <span style={linkStyle} onClick={() => setIsLogin(false)}>
                Register here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={linkStyle} onClick={() => setIsLogin(true)}>
                Login here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "none",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "underline",
  cursor: "pointer",
  fontWeight: "bold",
};