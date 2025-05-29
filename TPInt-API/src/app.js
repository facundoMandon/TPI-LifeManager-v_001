import express from "express";
import projectsRoutes from "./routes/projects.routes.js";

const app = express(); //creamos la app que ejecuta express
app.use(express.json()); // para poder parsear JSON en las requests, y guarda el body en req.body
app.use(projectsRoutes); //le decimos a express que use las rutas de projects.routes.js
//y luego la exportamos para ejecutarla en otro lado (index.js)
export default app; 
