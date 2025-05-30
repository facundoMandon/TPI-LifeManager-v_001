import { where } from 'sequelize';
import Project from '../models/Projects.js';

export const getProjects = async (req, res) => {
  const projects = await Project.finnAll();
  console.log("Projects:", projects);
  res.json(projects);
}

export const createProject = async (req, res) => {
  try {
    console.log("REQ.BODY COMPLETO:", req.body);
  const { name, description, priority, userId } = req.body;
  if (!name || !description || !priority) {
    return res.status(400).send('All fields are required');
  }
  // Chequea que el proyecto no exista actualmente
  const existingProject = await Project.findOne({
    where: { name }
  });
  if (existingProject) {
    return res.status(400).send('Project already exists');
  }
  // Crea un nuevo proyecto
  const newProject = await Project.create({ //faltan agregar los campos initDate, endDate y state
    name,
    description,
    priority,
    userId,
    initDate: new Date(), // Asigna la fecha actual como fecha de inicio
    endDate: null, // Inicialmente no hay fecha de finalización
    state: 'pending' // Estado inicial del proyecto
  })

  console.log(newProject);

  res.json(newProject);
}
  catch (error) {
        console.error('Error creating project:', error);
    res.status(500).send('Internal Server Error');
  };
};

export const getProjectbyId = (req, res) => {
  const { id } = req.params;
  res.send(`Getting project with id: ${id}`);
}

export const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Project.update(req.body, {
      where: { id }
    });
    if (!updated) {
      return res.status(404).send('Project not found');
    }
    const updatedProject = await Project.findByPk(id);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Internal Server Error');
  }
}

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Project.destroy({
      where: { id }
    });
    if (!deleted) {
      return res.status(404).send('Project not found');
    }
    res.sendStatus(204); // No content
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('Internal Server Error');
  }
}

export const getProjectsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.findAll({
      where: { userId }
    });
    if (!projects.length) {
      return res.status(404).send('No projects found for this user');
    }
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by user ID:', error);
    res.status(500).send('Internal Server Error');
  }
}

