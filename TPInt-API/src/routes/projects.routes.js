import { Router } from "express";
import { getProjects, createProject, getProjectbyId, updateProject, deleteProject, getProjectsByUserId } from "../controllers/projects.controller.js";

const router = Router();

router.get("/projects", getProjects);
router.get("/projects/:id", getProjectbyId);
router.get("/projects/user/:userId", getProjectsByUserId); 
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);


export default router;