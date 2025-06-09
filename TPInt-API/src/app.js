import express from "express";
import projectsRouter from "./routes/projects.routes.js";
import userRouter from "./routes/users.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import sectionsRouter from "./routes/sections.routes.js";
import entriesRouter from "./routes/entries.routes.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"; //importamos cors para poder hacer peticiones desde el frontend
import dotenv from "dotenv"; //importamos dotenv para poder usar las variables de entorno




dotenv.config(); //cargamos las variables de entorno desde el archivo .env

const app = express(); //creamos la app que ejecuta express

app.use(cors({
  origin: 'http://localhost:3000', // permití solo el frontend
  credentials: true, // opcional si vas a usar cookies o auth
}));
app.use(express.json()); // para poder parsear JSON en las requests, y guarda el body en req.body
app.use("/projects", projectsRouter); //le decimos a express que use las rutas de projects.routes.js
app.use("/users", userRouter); //le decimos a express que use las rutas de users.routes.js
app.use("/tasks", tasksRouter); //le decimos a express que use las rutas de tasks.routes.js
app.use("/sections", sectionsRouter); //le decimos a express que use las rutas de sections.routes.js
app.use("/entries", entriesRouter); //le decimos a express que use las rutas de entries.routes.js
app.use("/auth", authRouter);
//y luego la exportamos para ejecutarla en otro lado (index.js)
app.get("/", (req, res) => {
  res.send("API funcionando");}); //ruta de prueba para ver si la API está funcionando
export default app;  
