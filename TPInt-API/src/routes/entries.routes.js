import { Router } from "express";
import { getEntries, createEntry, getEntryById, updateEntry, deleteEntry, getEntriesByUserId } from "../controllers/entry.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/require.role.js";
const router = Router();

router.get("/", getEntries, verifyToken, requireRole); // Ruta para obtener todas las entradas
router.get("/:id", getEntryById, verifyToken);
router.post("/", createEntry, verifyToken, requireRole);
router.put("/:id", updateEntry, verifyToken);
router.delete("/:id", deleteEntry, verifyToken, requireRole);
router.get("/user/:userId", getEntriesByUserId, verifyToken); // Ruta para obtener entradas por userId
export default router;
