import { Card, Button } from "antd";
import { HeartOutlined } from "@ant-design/icons";

export default function RecipeCard({ recipe }) {
  return (
    <Card
      hoverable
      style={{
        width: 300,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      cover={
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            height: "200px",
            objectFit: "cover",
          }}
        />
      }
    >
      <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px" }}>
        {recipe.title || "No Title Available"}
      </h3>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
        <strong>By:</strong> {recipe.postedBy || "Unknown"}
      </p>
      <Button
        type="text"
        icon={<HeartOutlined style={{ fontSize: "1.2rem", color: "#ff4d4f" }} />}
        style={{ float: "right" }}
      />
    </Card>
  );
}