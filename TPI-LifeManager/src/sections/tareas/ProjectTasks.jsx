import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Card, Badge } from 'react-bootstrap';
import { Footer } from '../../components'; 
import './ProjectTasks.css'; 

const ProjectTasks = () => {
  const { projectId } = useParams(); // Obtiene el ID del proyecto de la URL
  const navigate = useNavigate();

  const [project, setProject] = useState(null); // Estado para guardar los datos del proyecto
  const [projectTasks, setProjectTasks] = useState([]); // Tareas del proyecto actual
  const [showTaskModal, setShowTaskModal] = useState(false); // Modal para agregar/editar tarea
  const [editingTask, setEditingTask] = useState(null); // Tarea que se está editando
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    initDate: "",
    endDate: "",
    done: false,
    content: "",
  });

  const [showAlertModal, setShowAlertModal] = useState(false); // Para alertas de permisos
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // URLs del backend
  const API_PROJECTS_URL = "http://localhost:4000/projects";
  const API_TASKS_USER_URL = "http://localhost:4000/tasks/user";
  const API_TASKS_PROJECT_URL = "http://localhost:4000/tasks/project";
  const API_TASKS_URL = "http://localhost:4000/tasks";

  // Función para obtener el token y el ID/rol del usuario
  const getAuthData = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || !user.id || !user.rol) {
      console.warn("No hay token o datos de usuario, redirigiendo a login.");
      navigate("/login");
      return { token: null, userId: null, userRole: null };
    }
    return { token, userId: user.id, userRole: user.rol };
  };

  // Cargar datos del usuario y el proyecto al inicio
  useEffect(() => {
    const { userId, userRole } = getAuthData();
    setCurrentUserId(userId);
    setUserRole(userRole);

    if (projectId) {
      fetchProjectDetails(projectId);
      fetchTasksByProjectId(projectId);
    }
  }, [projectId]);

  // Función auxiliar para verificar si un objeto está vacío o es nulo/indefinido
  const isObjectEmpty = (obj) => {
    return obj === null || typeof obj === 'undefined' || (Object.keys(obj).length === 0 && obj.constructor === Object);
  };

  const fetchProjectDetails = async (id) => {
    try {
      const token = getAuthData().token;
      console.log('--- Iniciando fetchProjectDetails ---');
      console.log(`Intentando obtener detalles del proyecto de: ${API_PROJECTS_URL}/${id}`);
      const res = await fetch(`${API_PROJECTS_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`Respuesta de fetchProjectDetails: Status ${res.status}, OK: ${res.ok}`);

      if (res.status === 401) { alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo."); navigate("/login"); return; }
      if (res.status === 403) { alert("No tienes permiso para ver este proyecto."); navigate("/trabajo"); return; }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error no-OK al obtener detalles del proyecto:", res.status, errorText);
        throw new Error(`Error al obtener detalles del proyecto: ${res.status} - ${errorText}`);
      }

      const responseBody = await res.text(); //sirve para obtener el cuerpo de la respuesta como texto
      console.log('Cuerpo de respuesta (texto) de fetchProjectDetails:', responseBody);
      console.log('Longitud del cuerpo de respuesta:', responseBody.length);

      let data;
      // Verificar si el cuerpo de la respuesta está vacío o solo contiene espacios en blanco
      if (!responseBody.trim()) { //trim elimina espacios en blanco al inicio y al final
          console.warn('Cuerpo de respuesta de proyectos está vacío o solo contiene espacios en blanco.');
          throw new Error('La respuesta del servidor para los detalles del proyecto está vacía.');
      }

      try {
        data = JSON.parse(responseBody); // Intenta parsear el texto a JSON
        console.log('Cuerpo de respuesta (JSON parseado) de fetchProjectDetails:', data);
        console.log('¿Es un objeto vacío el JSON parseado?', isObjectEmpty(data)); // Verifica si el objeto es vacío
      } catch (jsonError) {
        console.error('Error al parsear el JSON de los detalles del proyecto:', jsonError, 'Cuerpo recibido:', responseBody);
        throw new Error('La respuesta del servidor no es un JSON válido para los detalles del proyecto.');
      }

      // Si el JSON se parseó correctamente pero es un objeto vacío
      if (isObjectEmpty(data)) {
          console.warn('El objeto de proyecto recibido está vacío.');
          throw new Error('El servidor devolvió un objeto de proyecto vacío.');
      }

      setProject(data);
    } catch (err) {
      console.error("Error al cargar detalles del proyecto (catch block):", err.message, err.stack, err);
      alert("Error al cargar los detalles del proyecto: " + err.message);
      navigate("/trabajo");
    } finally {
        console.log('--- Finalizando fetchProjectDetails ---');
    }
  };

  const fetchTasksByProjectId = async (id) => {
    try {
      const token = getAuthData().token;
      console.log(`Intentando obtener tareas de proyecto de: ${API_TASKS_PROJECT_URL}/${id}`);
      const res = await fetch(`${API_TASKS_PROJECT_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`Respuesta de fetchTasksByProjectId: Status ${res.status}, OK: ${res.ok}`);

      if (res.status === 401) { alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo."); navigate("/login"); return; }
      if (res.status === 403) { alert("No tienes permiso para ver las tareas de este proyecto."); setProjectTasks([]); return; }
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error no-OK al obtener tareas del proyecto:", res.status, errorText);
        throw new Error(`Error al obtener tareas del proyecto: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log('Tareas del proyecto obtenidas:', data);
      setProjectTasks(data);
    } catch (err) {
      console.error("Error al cargar tareas del proyecto (catch block):", err);
      setProjectTasks([]);
      alert("Error al cargar las tareas del proyecto.");
    }
  };

  // --- Funciones para el Modal de Tareas ---

  const handleOpenTaskModal = (task = null) => {
    if (userRole !== "admin" && userRole !== "superadmin") {
      setShowAlertModal(true);
      return;
    }
    setEditingTask(task);
    setTaskForm(task ? {
      title: task.title,
      description: task.description,
      initDate: task.initDate ? task.initDate.split('T')[0] : '',
      endDate: task.endDate ? task.endDate.split('T')[0] : '',
      done: task.done,
      content: task.content || '',
    } : {
      title: "",
      description: "",
      initDate: "",
      endDate: "",
      done: false,
      content: "",
    });
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setTaskForm({ title: "", description: "", initDate: "", endDate: "", done: false, content: "" });
  };

  const handleTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthData().token;
    if (!token) return;

    if (!projectId) {
      alert("Error: ID de proyecto no encontrado para crear/editar la tarea.");
      return;
    }

    if (userRole !== "admin" && userRole !== "superadmin") {
      alert("Solo los administradores o superadministradores pueden crear/editar tareas.");
      return;
    }

    const taskData = { ...taskForm };

    try {
      let res;
      if (editingTask) {
        console.log('Intentando actualizar tarea:', `${API_TASKS_URL}/${editingTask.id}`);
        res = await fetch(`${API_TASKS_URL}/${editingTask.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(taskData),
        });
      } else {
        console.log('Intentando crear tarea para proyecto:', `${API_TASKS_URL}/${projectId}`);
        res = await fetch(`${API_TASKS_URL}/${projectId}`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(taskData),
        });
      }

      if (res.status === 401) { alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo."); navigate("/login"); return; }
      if (res.status === 403) { alert("No tienes permiso para realizar esta acción."); return; }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al guardar tarea: ${res.status} - ${errorText}`);
      }

      const savedTask = await res.json();
      if (editingTask) {
        setProjectTasks((prev) => prev.map((t) => (t.id === savedTask.id ? savedTask : t)));
      } else {
        setProjectTasks((prev) => [...prev, savedTask]);
      }

      handleCloseTaskModal();
      fetchTasksByProjectId(projectId);
    } catch (err) {
      console.error("Error al guardar tarea:", err);
      alert("Ocurrió un error al guardar la tarea.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (userRole !== "superadmin") {
      setShowAlertModal(true);
      return;
    }
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;

    const token = getAuthData().token;
    if (!token) return;

    try {
      console.log('Intentando eliminar tarea:', `${API_TASKS_URL}/${taskId}`);
      const res = await fetch(`${API_TASKS_URL}/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) { alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo."); navigate("/login"); return; }
      if (res.status === 403) { alert("No tienes permiso para realizar esta acción."); return; }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al eliminar tarea: ${res.status} - ${errorText}`);
      }

      setProjectTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la tarea.");
    }
  };

  const tileContent = ({ date, view }) => {

    if (view === 'month') {
      const dayTasks = tasksForCalendar.filter(task => {
        const taskInitDate = new Date(task.initDate);
        return taskInitDate.toDateString() === date.toDateString();
      });

      return (
        <div>
          {dayTasks.map(task => (
            <div
              key={task.id}
              className="calendar-task-item"
              style={{
                backgroundColor: task.done ? 'rgba(0, 128, 0, 0.7)' : 'rgba(214, 214, 30, 0.98)',
                color: task.done ? 'white' : 'black',
              }}
              title={task.title + (task.description ? ` - ${task.description}` : '')}
            >
              {task.title}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className="container text-white mt-4 min-vh-100">
        <h1 className="text-center mb-4">
          Tareas del Proyecto: {project ? project.name : 'Cargando...'}
        </h1>
        <p className="text-center">Gestiona las tareas específicas de este proyecto.</p>

        {(userRole === "admin" || userRole === "superadmin") && (
          <div className="text-center my-4">
            <Button variant="success" onClick={() => handleOpenTaskModal()}>
              Agregar Nueva Tarea
            </Button>
          </div>
        )}

        {projectTasks.length === 0 ? (
          <p className="text-center text-muted">No hay tareas para este proyecto. ¡Agrega una!</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {projectTasks.map(task => (
              <div className="col" key={task.id}>
                <Card className="h-100 task-card-custom">
                  <Card.Header className="task-card-header-custom" style={{
                    backgroundColor: task.done ? 'rgba(0, 128, 0, 0.7)' : 'rgba(214, 214, 30, 0.98)',
                  }}>
                    <h5 className="mb-0">{task.title}</h5>
                  </Card.Header>
                  <Card.Body className="task-card-body-custom">
                    <Card.Text><strong>Descripción:</strong> {task.description}</Card.Text>
                    <Card.Text><strong>Inicio:</strong> {new Date(task.initDate).toLocaleDateString('es-ES')}</Card.Text>
                    {task.endDate && <Card.Text><strong>Fin:</strong> {new Date(task.endDate).toLocaleDateString('es-ES')}</Card.Text>}
                    <Card.Text>
                      <strong>Estado: </strong>
                      <Badge bg={task.done ? "success" : "warning"}>
                        {task.done ? "Finalizada" : "Pendiente"}
                      </Badge>
                    </Card.Text>
                    {task.content && (
                      <>
                        <Card.Text><strong>Notas:</strong></Card.Text>
                        <Card.Text className="task-content-preview-custom">{task.content}</Card.Text>
                      </>
                    )}
                  </Card.Body>
                  <Card.Footer className="text-end bg-transparent border-0 pt-0">
                    {(userRole === "admin" || userRole === "superadmin") && (
                      <Button variant="info" size="sm" className="me-2" onClick={() => handleOpenTaskModal(task)}>
                        Editar
                      </Button>
                    )}
                    {userRole === "superadmin" && (
                      <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        Eliminar
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        )}

        <Modal show={showTaskModal} onHide={handleCloseTaskModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingTask ? "Editar Tarea" : "Agregar Tarea"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleTaskSubmit}>
            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskChange}
                  rows={2}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="initDate"
                  value={taskForm.initDate}
                  onChange={handleTaskChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Fecha de Fin (opcional)</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={taskForm.endDate}
                  onChange={handleTaskChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Tarea Finalizada"
                  name="done"
                  checked={taskForm.done}
                  onChange={handleTaskChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Contenido (Bloc de Notas)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={taskForm.content}
                  onChange={handleTaskChange}
                  rows={5}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseTaskModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editingTask ? "Guardar Cambios" : "Agregar Tarea"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal
          show={showAlertModal}
          onHide={() => setShowAlertModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Acceso restringido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Solo los administradores (o superadministradores para eliminar) pueden realizar esta acción.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
      <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados." />
    </>
  );
};

export default ProjectTasks;
