import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectbyId,
  updateProject,
  deleteProject,
  getProjectsByUserId,
} from "../controllers/projects.controller.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectbyId);
router.get("/user/:userId", getProjectsByUserId);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);


export default router;
