import { Router } from "express";
import {
  getSections,
  getAllSectionsByUserId,
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/sections.controller.js";

import tasksRouter from "./tasks.routes.js"; // Importo router de tareas

const router = Router();

router.get("/", getSections);
router.get("/user/:userId", getAllSectionsByUserId);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

// Montar el router de tareas como subruta en /:sectionId/tasks
router.use("/:sectionId/tasks", tasksRouter);

export default router;
