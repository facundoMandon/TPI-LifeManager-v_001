import { Router } from "express";
import { getProjects, createProject, getProjectbyId } from "../controllers/projects.controller.js";

const router = Router();

router.get("/projects", getProjects);

router.post("/projects", createProject);

router.delete("/projects/id", (req, res) => {
  res.send("Delete a project by id");
});

router.put("/projects/id", (req, res) => {
  res.send("Update a project by id");
});

router.get("/projects/:id", getProjectbyId);


export default router;