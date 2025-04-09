import express from "express";
import { createProject, getProjects, addToCart, getCart, removeProject, deleteCart } from "../controllers/project.controller";
const router = express.Router();

// Project routes
router.get("/projects", getProjects);
router.post("/project", createProject);
//router.delete("/project/:id", removeProject);

// Cart routes
router.post("/cart", addToCart);
router.get("/cart", getCart);
router.delete("/cart/:id",deleteCart);

export default router;
