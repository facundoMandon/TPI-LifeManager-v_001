import { Footer, Header } from "../../components";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // <-- Importa useNavigate

const initialProjects = [
    {
        id: 1,
        name: "Proyecto A",
        initDate: "2024-06-01",
        endDate: "2024-07-01",
        state: "En progreso",
        priority: 2,
        description: "Descripción del Proyecto A",
        userId: 1,
    },
    {
        id: 2,
        name: "Proyecto B",
        initDate: "2024-05-15",
        endDate: "2024-06-30",
        state: "Pendiente",
        priority: 1,
        description: "Descripción del Proyecto B",
        userId: 1,
    },
];

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

    const navigate = useNavigate(); // <-- Hook para navegación

    useEffect(() => {
        setProjects(initialProjects);
    }, []);

    const handleShowModal = (project = null) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProject) {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === editingProject.id
                        ? { ...editingProject, ...form }
                        : p
                )
            );
        } else {
            setProjects((prev) => [
                ...prev,
                {
                    ...form,
                    id: Date.now(),
                    userId: 1,
                },
            ]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este proyecto?")) {
            setProjects((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const handleRowClick = (id) => {
        navigate(`/project/${id}/tasks`);
    };

    return (
        <>
            <div className="container text-white mt-4 min-vh-100">
                <div className="mt-4 d-flex flex-column align-items-center">
                    <h1 className="text-center mb-4">Trabajo</h1>
                    <p className="text-center">Aquí puedes gestionar tus tareas laborales, proyectos y horarios.</p>
                    <div className="d-flex justify-content-between align-items-center mb-3 w-100" style={{maxWidth: 1000}}>
                        <h2 className="mb-0">Proyectos laborales</h2>
                        <Button variant="success" onClick={() => handleShowModal()}>
                            Agregar proyecto
                        </Button>
                    </div>
                    <div className="w-100" style={{maxWidth: 1000}}>
                        <Table striped bordered hover variant="dark" responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>Estado</th>
                                    <th>Prioridad</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
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
                                            <td>{project.initDate}</td>
                                            <td>{project.endDate}</td>
                                            <td>
                                                <Badge bg={
                                                    project.state === "En progreso"
                                                        ? "primary"
                                                        : project.state === "Pendiente"
                                                        ? "warning"
                                                        : "success"
                                                }>
                                                    {project.state}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={
                                                    project.priority === 3
                                                        ? "danger"
                                                        : project.priority === 2
                                                        ? "warning"
                                                        : "secondary"
                                                }>
                                                    {priorityLabels[project.priority - 1] || "Baja"}
                                                </Badge>
                                            </td>
                                            <td>{project.description}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="info"
                                                    className="me-2"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleShowModal(project);
                                                    }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleDelete(project.id);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
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
                </div>
            </div>

            <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados."/>
        </>
    );
};

export default Trabajo;
