import { Section } from '../models/Section.js';

export const getSections = async (req, res) => { // Ahora esta ruta traerá TODAS las secciones generales para todos los usuarios autenticados.
    try {
        console.log('--- Iniciando getSections (todas las secciones generales) ---');
        console.log('Usuario autenticado (req.user):', req.user); // Para depuración: muestra quién hace la petición

        const sections = await Section.findAll(); // Busca todas las secciones sin filtrar por userId
        console.log("Secciones encontradas (todas):", sections.length > 0 ? "Sí" : "No", "Cantidad:", sections.length);
        res.status(200).json(sections); // Siempre devuelve 200 OK con el array (vacío o con datos)
    } catch (error) {
        console.error('Error al obtener todas las secciones:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const createSection = async (req, res) => {
    try {
        console.log("--- Iniciando createSection ---");
        console.log("REQ.BODY COMPLETO:", req.body);
        console.log("Usuario que intenta crear (req.user):", req.user); // Para depuración: muestra quién la crea

        const { name } = req.body; // La propiedad 'userId' ya no se espera en el body para secciones generales

        if (!name || name.trim() === '') {
            console.warn('Falta el nombre de la sección en la creación.');
            return res.status(400).send('El nombre de la sección es requerido.');
        }

        // Verifica si una sección con este nombre ya existe (a nivel global, ya que son secciones generales)
        const existingSection = await Section.findOne({
            where: { name: name.trim() }, // Trim para evitar espacios extra
        });

        if (existingSection) {
            console.warn(`Sección '${name.trim()}' ya existe.`);
            return res.status(400).send('Ya existe una sección general con este nombre.');
        }

        // Crea una nueva sección general (sin asociar un userId en el modelo)
        const newSection = await Section.create({
            name: name.trim(),
            // 'userId' ya no se asigna aquí, la sección es general para todos
        });
        console.log("Nueva sección general creada exitosamente:", newSection.toJSON(), " por usuario ID:", req.user.id);
        res.status(201).json(newSection); // 201 Created para indicar que el recurso fue creado exitosamente
    } catch (error) {
        console.error('Error al crear sección:', error);
        res.status(500).send('Error interno del servidor');
    }
};


export const updateSection = async (req, res) => {
    try {
        console.log('--- Iniciando updateSection ---');
        console.log('ID de sección a actualizar (req.params.id):', req.params.id);
        console.log('Datos de actualización (req.body):', req.body);
        console.log('Usuario que intenta actualizar (req.user):', req.user); // Para depuración

        const { id } = req.params;
        // La validación de rol ya se maneja en sections.routes.js con requireRole(['admin', 'superadmin'])

        // Primero, verifica si la sección existe
        const sectionToUpdate = await Section.findByPk(id);

        if (!sectionToUpdate) {
            console.warn(`Sección general con ID ${id} no encontrada para actualización.`);
            return res.status(404).send('Sección general no encontrada.');
        }

        // Si el nombre se está actualizando, verifica si el nuevo nombre ya existe (excluyendo la propia sección)
        if (req.body.name && req.body.name.trim() !== sectionToUpdate.name) {
            const existingSection = await Section.findOne({
                where: { name: req.body.name.trim() }
            });
            if (existingSection && existingSection.id !== parseInt(id, 10)) {
                console.warn(`El nuevo nombre '${req.body.name.trim()}' ya está en uso por otra sección.`);
                return res.status(400).send('Ya existe otra sección general con este nombre.');
            }
        }

        // Actualiza la sección con los datos del cuerpo de la solicitud
        // Asegúrate de que solo se actualicen los campos permitidos (ej. 'name')
        const [updatedRowsCount] = await Section.update(
            { name: req.body.name ? req.body.name.trim() : sectionToUpdate.name }, // Solo actualiza el nombre
            { where: { id } }
        );

        if (updatedRowsCount === 0) {
            console.warn(`La sección general con ID ${id} no pudo ser actualizada (0 filas afectadas).`);
            // Podría ser 0 si no hay cambios en los datos o si la sección no se encontró (aunque ya se verificó)
            return res.status(200).send('Sección actualizada sin cambios o no encontrada.'); // 200 OK si no hay cambios, no 404
        }

        const updatedSection = await Section.findByPk(id); // Vuelve a buscar la sección para obtener los datos actualizados
        console.log('Sección general actualizada exitosamente:', updatedSection.toJSON());
        res.json(updatedSection); // Retorna la sección actualizada
    } catch (error) {
        console.error('Error al actualizar sección:', error);
        res.status(500).send('Error interno del servidor al actualizar la sección.');
    }
};

export const deleteSection = async (req, res) => {
    try {
        console.log('--- Iniciando deleteSection ---');
        console.log('ID de sección a eliminar (req.params.id):', req.params.id);
        console.log('Usuario que intenta eliminar (req.user):', req.user); // Para depuración

        const { id } = req.params;
        // La validación de rol 'superadmin' ya se maneja en sections.routes.js

        // Primero, verifica si la sección existe antes de intentar eliminarla
        const sectionToDelete = await Section.findByPk(id);

        if (!sectionToDelete) {
            console.warn(`Sección general con ID ${id} no encontrada para eliminación.`);
            return res.status(404).send('Sección general no encontrada.');
        }

        const deletedRowsCount = await Section.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            console.warn(`La sección general con ID ${id} no pudo ser eliminada (0 filas afectadas).`);
            // Esto no debería ocurrir si sectionToDelete no fue null, pero se mantiene como una capa de seguridad
            return res.status(404).send('Sección general no encontrada o ya eliminada.');
        }
        console.log(`Sección general con ID ${id} eliminada exitosamente.`);
        res.sendStatus(204); // 204 No Content para indicar eliminación exitosa sin contenido de respuesta
    } catch (error) {
        console.error('Error al eliminar sección:', error);
        res.status(500).send('Error interno del servidor al eliminar la sección.');
    }
};