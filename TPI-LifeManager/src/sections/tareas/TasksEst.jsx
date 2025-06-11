// src/components/tasksEst.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importamos useNavigate
// Importamos los componentes necesarios de React Bootstrap
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
// Asegúrate de que el CSS de Bootstrap esté importado en tu App.jsx o index.js
// import 'bootstrap/dist/css/bootstrap.min.css';

// Asegúrate de que esta URL sea correcta para tu backend (puerto 4000)
const API_BASE_URL = 'http://localhost:4000';

// Componente principal para gestionar las tareas de estudio
function TasksEstPage() {
  const { id } = useParams();
  const sectionId = id;
  const navigate = useNavigate(); // Hook para redirigir

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de nueva tarea
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    initDate: '',
    endDate: '',
    done: false,
    content: ''
  });


  // Función para obtener el token del localStorage
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, redirigir al login
      alert('Tu sesión ha expirado o no has iniciado sesión. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return null;
    }
    return token;
  };

  // Efecto para cargar las tareas cuando el componente se monta o sectionId cambia
  useEffect(() => {
    if (!sectionId) {
      setError("No se proporcionó un ID de sección.");
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      const token = getToken(); // Obtener el token
      if (!token) { // Si no hay token, la función getToken ya redirigió
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/estudios/${sectionId}/tasksEst`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          // Si es un error 401 o 403, redirigir al login
          if (response.status === 401 || response.status === 403) {
             alert('Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.');
             navigate('/login');
             return;
          }
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (e) {
        console.error("Error al cargar las tareas:", e);
        setError("No se pudieron cargar las tareas. Por favor, intente de nuevo. Detalle: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [sectionId, navigate]);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Función para manejar el envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
        setLoading(false);
        return;
    }

    // Decide si es una creación o actualización de tarea
    // Si currentTask está definido, significa que estamos editando una tarea existente
    // caso contrario, estamos creando una nueva tarea
    const method = currentTask ? 'PUT' : 'POST';
    const url = currentTask
      ? `${API_BASE_URL}/estudios/${sectionId}/tasksEst/${currentTask.id}`
      : `${API_BASE_URL}/estudios/${sectionId}/tasksEst`;

      //creo un objeto payload con los datos del formulario
      //y cambio las fechas a formato ISO si están definidas
    const payload = {
      ...formData,
      initDate: formData.initDate ? new Date(formData.initDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` //
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
            alert('Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.');
            navigate('/login');
            return;
        }
        throw new Error(errorData.message || `Error HTTP! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      if (currentTask) { // si existe una tarea actual, actualizamos
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task))); // si task.id es igual a updatedTask.id, actualizamos la tarea, sino dejamos la tarea como estaba
      } else {
        setTasks([...tasks, updatedTask]); // agregamos la nueva tarea a la lista (al final)
      }
      resetForm();
      setShowForm(false);
    } catch (e) {
      console.error("Error al guardar la tarea:", e);
      setError(`Error al guardar la tarea: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para editar una tarea existente
  const handleEdit = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      initDate: task.initDate ? new Date(task.initDate).toISOString().split('T')[0] : '',
      endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : '',
      done: task.done,
      content: task.content || ''
    });
    setShowForm(true);
  };

  // Función para eliminar una tarea
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    setLoading(true);
    setError(null);
    const token = getToken(); // Obtener el token
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/estudios/${sectionId}/tasksEst/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // <--- ENVIAR EL TOKEN AQUÍ
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            alert('Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.');
            navigate('/login');
            return;
        }
        throw new Error(`Error HTTP! status: ${response.status}`);
      }

      setTasks(tasks.filter(task => task.id !== id));
    } catch (e) {
      console.error("Error al eliminar la tarea:", e);
      setError("No se pudo eliminar la tarea. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar una tarea como completada/no completada
  const toggleDone = async (task) => {
    setLoading(true);
    setError(null);
    const token = getToken(); 
    
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const updatedTask = { ...task, done: !task.done };
      const response = await fetch(`${API_BASE_URL}/estudios/${sectionId}/tasksEst/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
            alert('Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.');
            navigate('/login');
            return;
        }
        throw new Error(errorData.message || `Error HTTP! status: ${response.status}`);
      }

      const result = await response.json();
      setTasks(tasks.map(t => (t.id === result.id ? result : t)));
    } catch (e) {
      console.error("Error al actualizar estado de tarea:", e);
      setError(`Error al actualizar estado: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Resetea el formulario a su estado inicial
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      initDate: '',
      endDate: '',
      done: false,
      content: ''
    });
    setCurrentTask(null);
  };

  // Pantallas de carga y error con estilos de Bootstrap
  if (loading && !tasks.length) return ( // si loading es true y no hay tareas, mostramos el mensaje de carga
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <p className="fs-4 text-center">Cargando tareas de estudio...</p>
    </Container>
  );
  if (error) return ( // si hay un error, mostramos el mensaje de error
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <Alert variant="danger" className="text-center">
        <p className="fs-4 mb-0">Error: {error}</p>
      </Alert>
    </Container>
  );

  return (
    <Container fluid className="min-vh-100 text-white py-5">
      <Container className="my-5">
        <h1 className="display-4 fw-bold text-center mb-5 text-white">
          Tareas de Estudio para Sección: {sectionId}
        </h1>

        {/* Botón para abrir/cerrar el formulario */}
        <div className="text-center mb-5">
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            variant="success"
            size="lg"
            className="rounded-3 shadow-lg px-5 py-3"
          >
            {showForm ? 'Cancelar / Cerrar Formulario' : 'Agregar Nueva Tarea de Estudio'}
          </Button>
        </div>

        {/* Formulario para crear/editar tareas */}
        {showForm && (
          <Card className="bg-secondary p-4 mb-5 shadow-lg rounded-3"> {/* Fondo gris oscuro, padding, sombra y redondez */}
            <Card.Body>
              <Card.Title className="h2 fw-bold text-center mb-4 text-white">
                {currentTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3 text-white">
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTitle">
                      <Form.Label className="fw-bold">Título</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="text-black border-secondary rounded-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label className="fw-bold">Descripción</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="text-black border-secondary rounded-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3 text-white">
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formInitDate">
                      <Form.Label className="fw-bold">Fecha de Inicio</Form.Label>
                      <Form.Control
                        type="date"
                        name="initDate"
                        value={formData.initDate}
                        onChange={handleChange}
                        className="text-black border-secondary rounded-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formEndDate">
                      <Form.Label className="fw-bold">Fecha de Fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="text-black border-secondary rounded-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4 text-center " controlId="formDone">
                  <Form.Check
                    type="checkbox"
                    name="done"
                    label={<span className="fw-bold">Tarea Realizada</span>}
                    checked={formData.done}
                    onChange={handleChange}
                    className="text-white d-flex"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formContent">
                  <Form.Label className="fw-bold text-white">Contenido (Notas)</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={5}
                    className="text-black border-secondary rounded-2"
                    placeholder="Escribe notas o contenido detallado aquí..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button variant="success" type="submit" className="rounded-3 shadow px-4 py-2">
                    {currentTask ? 'Guardar Cambios' : 'Crear Tarea'}
                  </Button>
                  <Button variant="danger" onClick={() => { resetForm(); setShowForm(false); }} className="rounded-3 shadow px-4 py-2">
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* Lista de Tareas de Estudio */}
        {tasks.length === 0 ? (
          <p className="text-center fs-5 text-muted mt-5">No hay tareas de estudio para esta sección aún. ¡Crea una!</p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {tasks.map(task => (
              <Col key={task.id}>
                <Card className="h-100 bg-secondary text-white rounded-3 shadow-lg d-flex flex-column">
                  <Card.Body className="d-flex flex-column p-4">
                    <Row className="flex-grow-1">
                      <Col md={task.content ? 6 : 12} className="d-flex flex-column justify-content-start">
                        <div>
                          <Card.Title className={`h4 fw-bold mb-2 ${task.done ? 'text-decoration-line-through text-muted' : 'text-white'}`}>
                            {task.title}
                          </Card.Title>
                          {task.description && (
                            <Card.Text className="text-white-50 mb-3">{task.description}</Card.Text>
                          )}
                          <div className="small text-muted mb-4">
                            {task.initDate && (
                              <p className="mb-1"><strong>Inicio:</strong> {new Date(task.initDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            )}
                            {task.endDate && (
                              <p className="mb-1"><strong>Fin:</strong> {new Date(task.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            )}
                            <p className="mb-0">
                              <strong>Estado:</strong>
                              <Badge bg={task.done ? "success" : "danger"} className="ms-2">
                                {task.done ? 'Completada' : 'Pendiente'}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </Col>

                      {task.content && (
                        <Col md={6} className="d-flex">
                          <Card className={`w-100 text-white text-dark rounded-3 shadow-sm p-3`} style={{ border: 'none' }}>
                            <Card.Subtitle className="mb-3 fw-bold text-dark">Notas:</Card.Subtitle>
                            <Card.Text className="text-dark">{task.content}</Card.Text>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>

                  {/* Botones de acción */}
                  <Card.Footer className="bg-transparent border-0 pt-0 pb-2 text-end">
                    <Button
                      onClick={() => toggleDone(task)}
                      variant={task.done ? 'warning' : 'success'}
                      size="sm"
                      className="me-2 rounded-3"
                    >
                      {task.done ? 'Marcar Pendiente' : 'Marcar Completada'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(task)}
                      variant="info" // variant es info para un botón azul claro
                      size="sm"
                      className="me-2 rounded-3"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(task.id)}
                      variant="danger" // en este caso es danger para un botón rojo
                      size="sm"
                      className="rounded-3"
                    >
                      Eliminar
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default TasksEstPage;
