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
  getUsers
); 
router.get("/:id", verifyToken, getUserById); 
router.get("/email/:email", verifyToken, getUserByEmail); 
router.post("/", createUser); 
router.put("/:id", verifyToken, updateUser); 
router.delete("/:id", requireRole, verifyToken, deleteUser); 
router.get("/test", (req, res) => {
  res.json({ message: "Ruta /users/test funcionando!" });
});

export default router;
