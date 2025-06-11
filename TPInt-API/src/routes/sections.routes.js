import { Router } from "express";
import { getSections, createSection, updateSection, deleteSection } from "../controllers/sections.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = Router();

router.get("/", verifyToken, getSections);
router.post("/", verifyToken, requireRole(['admin', 'superadmin']), createSection);
router.put("/:id", verifyToken, requireRole(['admin', 'superadmin']), updateSection);
router.delete("/:id", verifyToken, requireRole("superadmin"), deleteSection);

export default router;
