import { Footer, Header } from "../../components";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar'; // Importa el componente Calendar
import 'react-calendar/dist/Calendar.css'; // Importa los estilos CSS del calendario
import "./Trabajo.css"; // Asegúrate de tener un archivo CSS para estilos personalizados

const priorityLabels = ["Baja", "Media", "Alta"];

const Trabajo = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({
    name: "",
    initDate: "",
    endDate: "",
    state: "",
    priority: 1,
    description: "",
  });

  const navigate = useNavigate();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [userRole, setUserRole] = useState(null); // Para almacenar el rol del usuario
  const [currentUserId, setCurrentUserId] = useState(null); // Para almacenar el ID del usuario actual
  const [calendarDate, setCalendarDate] = useState(new Date()); // Estado para la fecha actual del calendario
  const [tasksForCalendar, setTasksForCalendar] = useState([]); // Estado para todas las tareas para el calendario

  // URL del backend para proyectos y tareas
  const API_PROJECTS_URL = "http://localhost:4000/projects";
  // --- CAMBIO CLAVE AQUÍ: URL para tareas de un usuario ---
  const API_TASKS_USER_URL = "http://localhost:4000/tasks/user"; // Nueva URL base para tareas por usuario
  // --- CAMBIO CLAVE AQUÍ: URL para tareas de un proyecto ---
  const API_TASKS_PROJECT_URL = "http://localhost:4000/tasks/project"; // Nueva URL base para tareas por proyecto

  // La URL base para crear/editar/eliminar tareas individuales por ID sigue siendo la misma:
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

  // useEffect principal para cargar datos al inicio
  useEffect(() => {
    const { token, userId, userRole } = getAuthData(); // Obtener todo de una vez
    setCurrentUserId(userId);
    setUserRole(userRole);

    if (token && userId) { // Solo intentar cargar datos si hay token y userId válidos
      fetchProjects(token); // Pasar el token directamente
      fetchTasksForCalendar(userId, token); // Pasar userId y token directamente
    }
  }, []); // Dependencia vacía: se ejecuta solo una vez al montar el componente


  // --- Fetching de Proyectos (Global para todos los usuarios) ---
  const fetchProjects = async (token) => { // Recibe el token como argumento
    if (!token) return; // Si no hay token, salir

    try {
      console.log('Intentando obtener proyectos de:', API_PROJECTS_URL); // Log de depuración
      const res = await fetch(API_PROJECTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        navigate("/login");
        return;
      }
      if (res.status === 403) {
        alert("No tienes permiso para ver los proyectos.");
        setProjects([]);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener proyectos");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error al cargar proyectos:", err);
      // alert("Error al cargar los proyectos."); // Se comentó para evitar alertas repetitivas
    }
  };

  // --- Fetching de Tareas para el Calendario (basado en el usuario actual) ---
  const fetchTasksForCalendar = async (userId, token) => { // Recibe userId y token como argumentos
    if (!userId || !token) return; // Si falta userId o token, salir

    try {
      // --- CAMBIO APLICADO AQUÍ: URL para tareas por usuario ---
      console.log('Intentando obtener tareas para calendario de:', `${API_TASKS_USER_URL}/${userId}`); // Log de depuración
      const res = await fetch(`${API_TASKS_USER_URL}/${userId}`, { // URL actualizada
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        console.warn("Token expirado o inválido al intentar obtener tareas para el calendario.");
        setTasksForCalendar([]);
        // navigate("/login"); // No redirigir aquí para no interrumpir el flujo si ya está en la página
        return;
      }
      if (res.status === 403) {
        console.warn("No tienes permiso para ver las tareas para el calendario.");
        setTasksForCalendar([]);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener tareas para el calendario");
      const data = await res.json();
      setTasksForCalendar(data);
    } catch (err) {
      console.error("Error al cargar tareas para el calendario:", err);
      // setTasksForCalendar([]); // Ya se limpia en caso de 401/403
      // alert("Error al cargar las tareas del calendario."); // Se comentó
    }
  };


  const handleShowModal = (project = null) => {
    if (userRole !== "admin" && userRole !== "superadmin") {
      setShowAlertModal(true);
      return;
    }
    setEditingProject(project);
    setForm(
      project
        ? {
            name: project.name,
            initDate: project.initDate,
            endDate: project.endDate,
            state: project.state,
            priority: project.priority,
            description: project.description,
          }
        : {
            name: "",
            initDate: "",
            endDate: "",
            state: "",
            priority: 1,
            description: "",
          }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { token } = getAuthData();
    if (!token) return;

    const projectData = {
      ...form,
      userId: currentUserId, // Los proyectos son específicos del usuario
    };

    if (userRole !== "admin" && userRole !== "superadmin") {
      alert("Solo los administradores o superadministradores pueden crear/editar proyectos.");
      return;
    }

    try {
      let res;
      if (editingProject) {
        console.log('Intentando actualizar proyecto:', `${API_PROJECTS_URL}/${editingProject.id}`); // Log de depuración
        res = await fetch(
          `${API_PROJECTS_URL}/${editingProject.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(projectData),
          }
        );
      } else {
        console.log('Intentando crear proyecto en:', API_PROJECTS_URL); // Log de depuración
        res = await fetch(API_PROJECTS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        });
      }

      if (res.status === 401) {
        alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        navigate("/login");
        return;
      }
      if (res.status === 403) {
        alert("No tienes permiso para realizar esta acción.");
        return;
      }

      if (!res.ok) throw new Error("Error al guardar proyecto");

      const savedProject = await res.json();

      if (editingProject) {
        setProjects((prev) =>
          prev.map((p) => (p.id === savedProject.id ? savedProject : p))
        );
      } else {
        setProjects((prev) => [...prev, savedProject]);
      }

      handleCloseModal();
      fetchProjects(token); // Pasar token al actualizar
      fetchTasksForCalendar(currentUserId, token); // Pasar userId y token al actualizar
    } catch (err) {
      console.error("Error al guardar proyecto:", err);
      alert("Ocurrió un error al guardar el proyecto.");
    }
  };

  const handleDelete = async (id) => {
    if (userRole !== "superadmin") {
      setShowAlertModal(true);
      return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar este proyecto?")) return;

    const { token } = getAuthData();
    if (!token) return;

    try {
      console.log('Intentando eliminar proyecto:', `${API_PROJECTS_URL}/${id}`); // Log de depuración
      const res = await fetch(`${API_PROJECTS_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        navigate("/login");
        return;
      }
      if (res.status === 403) {
        alert("No tienes permiso para realizar esta acción.");
        return;
      }

      if (!res.ok) throw new Error("Error al eliminar proyecto");

      setProjects((prev) => prev.filter((p) => p.id !== id));
      fetchTasksForCalendar(currentUserId, token); // Pasar userId y token al actualizar
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el proyecto.");
    }
  };

  const handleRowClick = (id) => {
    navigate(`/project/${id}/tasks`);
  };

  // Función para renderizar el contenido de cada celda del calendario
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
                backgroundColor: task.done ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 255, 0, 0.7)',
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
        <div className="mt-4">
          <h1 className="text-center mb-4">Trabajo</h1>
          <p className="text-center">
            Aquí puedes gestionar tus tareas laborales, proyectos y horarios.
          </p>
          
          <div className="row" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* Columna del Calendario */}
            <div className="col-12 col-md-4 mb-4">
              <h3 className="text-center mb-3">Calendario de Tareas</h3>
              <div className="custom-calendar-container">
                <Calendar
                  onChange={setCalendarDate}
                  value={calendarDate}
                  locale="es-ES"
                  tileContent={tileContent}
                />
              </div>
            </div>

            {/* Columna de la Tabla de Proyectos */}
            <div className={
              (userRole === "admin" || userRole === "superadmin")
                ? "col-12 col-md-8 mb-4"
                : "col-12 col-md-8 mx-auto mb-4"
            }>
              {/* Encabezado con título de proyectos y botón de agregar */}
              <div
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <h2 className="mb-0">Proyectos laborales</h2>
                {(userRole === "admin" || userRole === "superadmin") && (
                  <Button
                    variant="success"
                    onClick={() => {
                      handleShowModal();
                    }}
                  >
                    Agregar proyecto
                  </Button>
                )}
              </div>
              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Descripción</th>
                    {(userRole === "admin" || userRole === "superadmin") && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={(userRole === "admin" || userRole === "superadmin") ? 7 : 6} className="text-center">
                        No hay proyectos aún.
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr
                        key={project.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(project.id)}
                      >
                        <td>{project.name}</td>
                        <td>{new Date(project.initDate).toLocaleDateString('es-ES')}</td>
                        <td>{project.endDate ? new Date(project.endDate).toLocaleDateString('es-ES') : 'N/A'}</td>
                        <td>
                          <Badge
                            bg={
                              project.state === "En progreso"
                                ? "primary"
                                : project.state === "Pendiente"
                                ? "warning"
                                : "success"
                            }
                          >
                            {project.state}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            bg={
                              project.priority === 3
                                ? "danger"
                                : project.priority === 2
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {priorityLabels[project.priority - 1] || "Baja"}
                          </Badge>
                        </td>
                        <td>{project.description}</td>
                        {(userRole === "admin" || userRole === "superadmin") && (
                          <td>
                            <Button
                              size="sm"
                              variant="info"
                              className="me-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(project);
                              }}
                            >
                              Editar
                            </Button>
                            {userRole === "superadmin" && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(project.id);
                                }}
                              >
                                Eliminar
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div> {/* Fin de la fila del Calendario y la Tabla */}

          {/* Modal de Agregar/Editar Proyecto */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {editingProject ? "Editar proyecto" : "Agregar proyecto"}
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha de inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="initDate"
                    value={form.initDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha de fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Finalizado">Finalizado</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Prioridad</Form.Label>
                  <Form.Select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value={1}>Baja</option>
                    <option value={2}>Media</option>
                    <option value={3}>Alta</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {editingProject ? "Guardar cambios" : "Agregar"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Modal de Alerta de Acceso Restringido */}
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
        </div> {/* Cierre del div principal */}
      </div> {/* Cierre del container */}

      <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados." />
    </>
  );
};

export default Trabajo;
