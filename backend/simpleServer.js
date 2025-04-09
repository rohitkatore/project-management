const express = require("express");
const cors = require("cors");
const app = express();
let prisma;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Initialize Prisma with error handling
async function initPrisma() {
  try {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize Prisma:", error.message);
    return false;
  }
}

// Simple in-memory data for fallback
const fallbackProjects = [
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

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.send(
    "Project Management API is running! " +
      (prisma ? "With Database" : "In Demo Mode")
  );
});

// Get all projects
app.get("/projects", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!prisma) {
      return res.json({
        projects: fallbackProjects,
        pagination: {
          total: fallbackProjects.length,
          page,
          limit,
          totalPages: 1,
          hasMore: false,
        },
      });
    }

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
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch projects", details: err.message });
  }
});

// Create a project
app.post("/project", async (req, res) => {
  try {
    const { title, description, category, author, image_url } = req.body;

    if (!prisma) {
      return res
        .status(201)
        .json({ message: "Project created successfully (demo mode)" });
    }

    const project = await prisma.project.create({
      data: { title, description, category, author, image_url },
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Failed to create project", details: err.message });
  }
});

// Get cart items
app.get("/cart", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";

    if (!prisma) {
      return res.json({ cartItems: [], count: 0 });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ cartItems, count: cartItems.length });
  } catch (err) {
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch cart", details: err.message });
  }
});

// Add to cart
app.post("/cart", async (req, res) => {
  try {
    const { projectId, userId = "guest" } = req.body;

    if (!prisma) {
      return res
        .status(201)
        .json({ message: "Project added to cart successfully (demo mode)" });
    }

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
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Failed to add to cart", details: err.message });
  }
});

// Delete from cart
app.delete("/cart/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    if (!prisma) {
      return res.json({
        message: "Cart item removed successfully (demo mode)",
      });
    }

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
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Failed to remove from cart", details: err.message });
  }
});

// Initialize server
async function startServer() {
  const hasPrisma = await initPrisma();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${
        hasPrisma ? "DATABASE" : "DEMO"
      } mode`
    );
  });
}

// Start server with Prisma initialization
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  if (prisma) {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  }
  process.exit(0);
});
