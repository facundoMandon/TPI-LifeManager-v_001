import { Entry } from "../models/entry.js";

export const getEntries = async (req, res) => {
    try {
        const entries = await Entry.findAll();
        console.log("Entries:", entries);
        res.json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const createEntry = async (req, res) => {
    try {
        console.log("REQ.BODY COMPLETO:", req.body);
        const { title, content, userId } = req.body;
        if (!title || !content || !userId) {
            return res.status(400).send('Title, content, and userId are required');
        }
        // Check if the entry already exists
        const existingEntry = await Entry.findOne({
            where: { title, userId },
        });
        if (existingEntry) {
            return res.status(400).send('Entry already exists for this user');
        }
        // Create a new entry
        const newEntry = await Entry.create({
            title,
            content,
            userId,
        });
        res.json(newEntry);
    } catch (error) {
        console.error('Error creating entry:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const getEntryById = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la entrada desde los parámetros de la solicitud
    try {
        const entry = await Entry.findByPk(id); // Busco la entrada por su id
        if (!entry) { // Si no se encuentra la entrada, retorno un error 404
            return res.status(404).send('Entry not found');
        }
        res.json(entry); // Si se encuentra, retorno la entrada en formato JSON
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const updateEntry = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la entrada desde los parámetros de la solicitud
    try {
        const [updated] = await Entry.update(req.body, { // Actualizo la entrada con los datos del cuerpo de la solicitud
            where: { id }
        });
        if (!updated) { // Si no se actualiza nada, retorno un error 404
            return res.status(404).send('Entry not found');
        }
        const updatedEntry = await Entry.findByPk(id); // Busco la entrada actualizada
        res.json(updatedEntry); // Retorno la entrada actualizada en formato JSON
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const deleteEntry = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la entrada desde los parámetros de la solicitud
    try {
        const deleted = await Entry.destroy({ // Elimino la entrada por su id
            where: { id }
        });
        if (!deleted) { // Si no se elimina nada, retorno un error 404
            return res.status(404).send('Entry not found');
        }
        res.sendStatus(204); // Retorno un estado 204 No Content si la eliminación fue exitosa
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
};

export const getEntriesByUserId = async (req, res) => {
    const { userId } = req.params; // Obtengo el userId desde los parámetros de la solicitud
    try {
        const entries = await Entry.findAll({ // Busco todas las entradas que pertenezcan al usuario
            where: { userId }
        });
        if (entries.length === 0) { // Si no se encuentran entradas, retorno un error 404
            return res.status(404).send('No entries found for this user');
        }
        res.json(entries); // Si se encuentran, retorno las entradas en formato JSON
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

