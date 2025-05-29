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
  const newProject = await Project.create({
    name,
    description,
    priority,
    userId
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