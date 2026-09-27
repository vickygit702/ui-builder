import { Router } from "express";
import buttonRoutes from "../modules/core/button/button.routes";
import authRoutes from "../modules/users/auth/auth.routes";
import projectRoutes from "../modules/users/project/project.routes";

const router = Router();

// Core components API: /api/core/components
router.use("/core/components", buttonRoutes);

// Users API: /api/users/auth, /api/users/project
router.use("/users/auth", authRoutes);
router.use("/users/project", projectRoutes);

export default router;
