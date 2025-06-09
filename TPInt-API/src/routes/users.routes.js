import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  deleteUser,
  createUser,
  updateUser,
} from "../controllers/users.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get(
  "/",
  /*verifyToken, lo comento solo para pruebas, luego lo tengo que volver a poner*/ getUsers
); // Solo para el administrador
router.get("/:id", verifyToken, getUserById); // Solo para el administrador
router.get("/email/:email", verifyToken, getUserByEmail); // Solo para el administrador
router.post("/", createUser); // Solo para el administrador
router.put("/:id", verifyToken, updateUser); // Solo para el administrador
router.delete("/:id", requireRole, verifyToken, deleteUser); // Solo para el administrador
router.get("/test", (req, res) => {
  res.json({ message: "Ruta /users/test funcionando!" });
});

export default router;
