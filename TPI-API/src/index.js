import express from 'express';
import { PORT } from './config.js';
import bookRoutes from '../routes/books.routes.js';
import { sequelize } from '../db.js';
import "../models/Book.js";

const app = express();

try {
    app.use(express.json());
    app.listen(PORT); //aranca el servidor
    app.use(bookRoutes); //usa las rutas

    await sequelize.sync(); //intenta conectarse a la BDD

    console.log(`Server listening on port ${ PORT }`);
} catch (error) {
    console.log(`There was an error on initialization`);
};
