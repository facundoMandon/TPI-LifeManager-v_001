import { Router } from "express";
import { getEntrys, createEntry, getEntryById, updateEntry, deleteEntry, getEntriesByUserId } from "../controllers/entry.controller.js";

const router = Router();

router.get("/entrys", getEntrys);
router.get("/entrys/:id", getEntryById);
router.post("/entrys", createEntry);
router.put("/entrys/:id", updateEntry);
router.delete("/entrys/:id", deleteEntry);
router.get("/entrys/user/:userId", getEntriesByUserId); // Ruta para obtener entradas por userId
export default router;
