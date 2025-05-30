import { where } from 'sequelize';
import Section from '../models/Section.js';

export const getSections = async (req, res) => { //solo para el administrador, para ver todas las secciones
    try {
        const sections = await Section.findAll();
        console.log("Sections:", sections);
        res.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const createSection = async (req, res) => {
    try {
        console.log("REQ.BODY COMPLETO:", req.body);
        const { name, description, userId } = req.body;
        if (!name || !description || !userId) {
            return res.status(400).send('Name, description, and userId are required');
        }
        // Check if the section already exists
        const existingSection = await Section.findOne({
            where: { name, userId },
        });
        if (existingSection) {
            return res.status(400).send('Section already exists for this user');
        }
        // Create a new section
        const newSection = await Section.create({
            name,
            description,
            userId,
        });
        res.json(newSection);
    } catch (error) {
        console.error('Error creating section:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const getAllSectionsByUserId = async (req, res) => { //para el usuario, para ver todas las secciones que le pertenecen
    const { userId } = req.params; // Obtengo el userId desde los parámetros de la solicitud
    try {
        const sections = await Section.findAll({ // Busco todas las secciones que pertenezcan al usuario
            where: { userId }
        });
        if (sections.length === 0) { // Si no se encuentran secciones, retorno un error 404
            return res.status(404).send('No sections found for this user');
        }
        res.json(sections); // Si se encuentran, retorno las secciones en formato JSON
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const updateSection = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la sección desde los parámetros de la solicitud
    try {
        const [updated] = await Section.update(req.body, { // Actualizo la sección con los datos del cuerpo de la solicitud
            where: { id }
        });
        if (!updated) { // Si no se actualizó ninguna sección, retorno un error 404
            return res.status(404).send('Section not found');
        }
        const updatedSection = await Section.findByPk(id); // Busco la sección actualizada
        res.json(updatedSection); // Retorno la sección actualizada en formato JSON
    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const deleteSection = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la sección desde los parámetros de la solicitud
    try {
        const deleted = await Section.destroy({ // Elimino la sección por su id
            where: { id }
        });
        if (!deleted) { // Si no se eliminó ninguna sección, retorno un error 404
            return res.status(404).send('Section not found');
        }
        res.sendStatus(204); // Retorno un estado 204 No Content si la eliminación fue exitosa
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}