import express from "express";
import projectsRouter from "./routes/projects.routes.js";
import userRouter from "./routes/users.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import sectionsRouter from "./routes/sections.routes.js";
import entriesRouter from "./routes/entries.routes.js";
import authRouter from "./routes/auth.routes.js";
import tasksEstRouter from "./routes/tasksEst.routes.js";

import cors from "cors"; //importamos cors para poder hacer peticiones desde el frontend
import dotenv from "dotenv"; //importamos dotenv para poder usar las variables de entorno




dotenv.config(); //cargamos las variables de entorno desde el archivo .env
// dotenv es para la contraseñas super secreta

const app = express(); //creamos la app que ejecuta express

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.use(express.json()); 
app.use("/projects", projectsRouter); 
app.use("/users", userRouter); 
app.use("/tasks", tasksRouter); 
app.use("/tasksEst", tasksEstRouter); 
app.use("/estudios/:sectionId/tasksEst", tasksEstRouter); 
app.use("/estudios/:sectionId/tasks", tasksRouter);  
app.use("/estudios", sectionsRouter); 
app.use("/sections", sectionsRouter); 
app.use("/entries", entriesRouter); 
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("API funcionando");}); //ruta de prueba para ver si la API está funcionando
export default app;  
