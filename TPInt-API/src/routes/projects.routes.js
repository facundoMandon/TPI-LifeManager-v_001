import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectbyId,
  updateProject,
  deleteProject,
  getProjectsByUserId,
} from "../controllers/projects.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/require.role.js";
const router = Router();

router.get("/", verifyToken, getProjects); 
router.get("/:id", verifyToken, getProjectbyId);
router.get("/user/:userId", verifyToken, getProjectsByUserId);
router.post("/", verifyToken, requireRole(["admin", "superadmin"]), createProject ); 
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, requireRole("superadmin"), deleteProject); 


export default router;
