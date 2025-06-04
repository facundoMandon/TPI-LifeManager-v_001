import { Router } from "express";
import { getEntries, createEntry, getEntryById, updateEntry, deleteEntry, getEntriesByUserId } from "../controllers/entry.controller.js";

const router = Router();

router.get("/", getEntries);
router.get("/:id", getEntryById);
router.post("/", createEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);
router.get("/user/:userId", getEntriesByUserId); // Ruta para obtener entradas por userId
export default router;
