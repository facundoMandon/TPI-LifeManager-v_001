import { Router } from "express";
import {
  getTasksEst,
  getTaskEst,
  createTaskEst,
  updateTaskEst,
  deleteTaskEst,
} from "../controllers/tasksEst.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router({ mergeParams: true }); //uso mergeParams para permitir el uso de 'sectionId' en las rutas
//sin el mergeParams, no se puede acceder a los parámetros de la ruta padre (sectionId) en las rutas hijas (tasksEst)
router.get("/",verifyToken, getTasksEst);         
router.get("/:id",verifyToken, getTaskEst);       
router.post("/",verifyToken, createTaskEst);      
router.put("/:id",verifyToken, updateTaskEst);    
router.delete("/:id",verifyToken, deleteTaskEst); 

export default router;
