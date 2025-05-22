import { Router } from "express";
import { Book } from "../models/Book.js";
import { sequelize } from "../db.js";

const router = Router();

router.get("/books", async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
    res.send("Obteniendo libros")
});
//que books/:id tenga dos puntos antes del id significa que lo que venga despues de los : es dinamico (puede cambiar)
// y justamente req.params sirve para detectar parametros DINAMICOS
router.get("/books/:id", (req, res) =>  {
    const { id } = req.params;
    res.send(`Obteniendo libro con id: ${id}`);
})


router.put("/books/:id", (req, res) =>  {
    const { id } = req.params;
    res.send(`Actualizando libro con id: ${id}`);
})


router.post("/books", async(req, res) =>  {
    const { title, author, rating, pageCount, summary, imageUrl, available} = req.body;
    const NewBook = await Book.create({
        title,
        author,
        rating,
        pageCount,
        summary,
        imageUrl,
        available
    })
    res.send("NewBook");
})


router.delete("/books/:id", (req, res) =>  {
    const { id } = req.params;
    res.send(`Borrando libro con id: ${id}`);
})


export default router;