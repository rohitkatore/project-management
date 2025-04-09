const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Simple in-memory data for initial deployment
const projects = [
  {
    id: "1",
    title: "Sample Project 1",
    description:
      "This is a placeholder project while the database connection is being set up",
    category: "Demo",
    author: "System",
    image_url: "https://picsum.photos/600/400?random=1",
  },
  {
    id: "2",
    title: "Sample Project 2",
    description: "Another placeholder project",
    category: "Demo",
    author: "System",
    image_url: "https://picsum.photos/600/400?random=2",
  },
];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Project Management API is running! (Simple Server)");
});

// Get all projects
app.get("/projects", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    res.json({
      projects,
      pagination: {
        total: projects.length,
        page,
        limit,
        totalPages: 1,
        hasMore: false,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Other simple endpoints
app.post("/project", (req, res) => {
  res.status(201).json({ message: "Project created successfully (demo mode)" });
});

app.get("/cart", (req, res) => {
  res.json({ cartItems: [], count: 0 });
});

app.post("/cart", (req, res) => {
  res
    .status(201)
    .json({ message: "Project added to cart successfully (demo mode)" });
});

app.delete("/cart/:id", (req, res) => {
  res.json({ message: "Cart item removed successfully (demo mode)" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
