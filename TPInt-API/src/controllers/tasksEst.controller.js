import { TasksEst } from '../models/TasksEst.js';

export const getTasksBySectionId = async (req, res) => {
    const { sectionId } = req.params;
    try {
        const tasks = await TasksEst.findAll({
            where: { sectionId: sectionId } // si sectionId es la columna que representa la sección
        });
        if (tasks.length === 0) {
            return res.status(404).send('No tasks found for this section');
        }
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by section ID:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const createTask = async (req, res) => {
    const { sectionId } = req.params; // ahora sectionId viene de la URL
    try {
        const { title, description, initDate, endDate } = req.body;
        if (!title || !description) {
            return res.status(400).send('Title and description are required');
        }

        // Check if the task already exists for this section
        const existingTask = await TasksEst.findOne({
            where: { title, sectionId: sectionId },
        });
        if (existingTask) {
            return res.status(400).send('Task already exists in this section');
        }

        const newTask = await TasksEst.create({
            title,
            description,
            initDate: initDate ? new Date(initDate) : new Date(),
            endDate: endDate ? new Date(endDate) : null, 
            done: false,
            sectionId: sectionId, // linkeo con la sección actual
            content: req.body.content || null,
        });

        res.json(newTask);
    }catch (error) {
  console.error('Error creating task:', error);
  res.status(500).json({ message: 'Internal Server Error', error: error.message });
}
};

export const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await TasksEst.findByPk(id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await TasksEst.update(req.body, { where: { id } });
        if (!updated) {
            return res.status(404).send('Task not found');
        }
        const updatedTask = await TasksEst.findByPk(id);
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await TasksEst.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).send('Task not found');
        }
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const getTasks = async (_req, res) => {
    try {
        const tasks = await TasksEst.findAll();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
};