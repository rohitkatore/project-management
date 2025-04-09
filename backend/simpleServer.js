const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Project Management API is running!");
});

// Get all projects
app.get("/projects", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await prisma.project.count();
    const projects = await prisma.project.findMany({
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      projects,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Create a project
app.post("/project", async (req, res) => {
  try {
    const { title, description, category, author, image_url } = req.body;
    const project = await prisma.project.create({
      data: { title, description, category, author, image_url },
    });
    res.status(201).json({ message: "Project created successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Get cart items
app.get("/cart", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ cartItems, count: cartItems.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add to cart
app.post("/cart", async (req, res) => {
  try {
    const { projectId, userId = "guest" } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const cartItem = await prisma.cart.create({
      data: { projectId, userId },
    });

    res.status(201).json({
      message: "Project added to cart successfully",
      cartItem,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Delete from cart
app.delete("/cart/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    const cartItem = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cart.delete({
      where: { id: cartId },
    });

    res.json({ message: "Cart item removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
