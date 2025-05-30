import { Router } from "express";
import { getUsers, getUserById, getUserByEmail, deleteUser, createUser, updateUser } from "../controllers/users.controller";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/users", verifyToken, getUsers); // Solo para el administrador
router.get("/users/:id", verifyToken, getUserById); // Solo para el administrador
router.get("/users/email/:email", verifyToken, getUserByEmail); // Solo para el administrador
router.post("/users", verifyToken, createUser); // Solo para el administrador
router.put("/users/:id", verifyToken, updateUser); // Solo para el administrador
router.delete("/users/:id", verifyToken, deleteUser); // Solo para el administrador

export default router;