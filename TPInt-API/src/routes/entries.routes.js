import { Router } from "express";
import { getEntries, createEntry, getEntryById, updateEntry, deleteEntry, getEntriesByUserId } from "../controllers/entry.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/require.role.js";
const router = Router();

router.get("/", verifyToken, requireRole("admin"), getEntries ); 
router.get("/:id", verifyToken, getEntryById);
router.post("/", verifyToken, requireRole('admin'), createEntry,);
router.put("/:id", verifyToken, updateEntry);
router.delete("/:id", verifyToken, requireRole('admin'), deleteEntry);
router.get("/user/:userId", getEntriesByUserId, verifyToken); 
export default router;
