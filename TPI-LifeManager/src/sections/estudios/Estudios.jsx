import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Header } from "../../components";

// Cambia la URL base según tu backend
const API_URL = "http://localhost:4000/projects";

const Estudios = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [initDate, setInitDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [state, setState] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      setProjects([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !initDate || !state || !priority) return;

    const body = {
      name,
      initDate,
      endDate: endDate || null,
      state,
      priority: Number(priority),
      description,
      // userId: ... // Si tienes el userId, agrégalo aquí
    };

    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setName("");
    setInitDate("");
    setEndDate("");
    setState("");
    setPriority("");
    setDescription("");
    setEditId(null);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleEdit = (project) => {
    setName(project.name || "");
    setInitDate(project.initDate ? project.initDate.slice(0, 10) : "");
    setEndDate(project.endDate ? project.endDate.slice(0, 10) : "");
    setState(project.state || "");
    setPriority(project.priority ? String(project.priority) : "");
    setDescription(project.description || "");
    setEditId(project.id);
  };

  return (
    <>
    
      <div className="container text-white">
        <h1 className="text-center my-4 text-white">Estudios</h1>
        <p className="text-center">Aquí puedes gestionar tus estudios.</p>
        <div className="row">
          <div className="col-md-6">
            <h2>{editId ? "Editar Estudio" : "Agregar Estudio"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre del Estudio
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="initDate" className="form-label">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="initDate"
                  value={initDate}
                  onChange={(e) => setInitDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  Fecha de Finalización
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {/* Estado eliminado del formulario */}
              <div className="mb-3">
                <label htmlFor="priority" className="form-label">
                  Prioridad
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editId ? "Guardar Cambios" : "Agregar"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setInitDate("");
                    setEndDate("");
                    setPriority("");
                    setDescription("");
                  }}
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
          <div className="col-md-6">
            <h2>Lista de Estudios</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <div className="row">
                {projects.map((project) => (
                  <div className="col-12 mb-3" key={project.id}>
                    <div className="card">
                      <div className="card-body">
                        <h5
                          className="card-title"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/estudios/project${project.id}`)
                          }
                        >
                          {project.name}
                        </h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Estado: {project.state} | Prioridad:{" "}
                          {project.priority}
                        </h6>
                        <p className="mb-1">
                          Inicio:{" "}
                          {project.initDate
                            ? project.initDate.slice(0, 10)
                            : "-"}
                          <br />
                          Fin:{" "}
                          {project.endDate ? project.endDate.slice(0, 10) : "-"}
                        </p>
                        <p className="mb-1">{project.description}</p>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleEdit(project)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(project.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-muted">No hay estudios cargados.</p>
                )}
              </div>
            )}
          </div>
        </div>
        {/* El resto de la página igual que antes */}
        <div className="my-4">
          <h2>Información Adicional</h2>
          <p>
            En esta sección puedes agregar más detalles sobre tus estudios, como
            fechas, calificaciones, etc.
          </p>
        </div>
        <div className="my-4">
          <h2>Consejos para el Estudio</h2>
          <ul className="list-unstyled">
            <li>Organiza tu tiempo de estudio.</li>
            <li>Utiliza técnicas de memorización.</li>
            <li>Haz pausas regulares.</li>
            <li>Revisa tus apuntes frecuentemente.</li>
          </ul>
        </div>
        <div className="my-4">
          <h2>Recursos Útiles</h2>
          <ul className="list-unstyled">
            <li>
              <a
                href="https://www.khanacademy.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Khan Academy
              </a>
            </li>
            <li>
              <a
                href="https://www.coursera.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Coursera
              </a>
            </li>
            <li>
              <a
                href="https://www.edx.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                edX
              </a>
            </li>
          </ul>
        </div>
        <div className="my-4">
          <h2>Contacto</h2>
          <p>
            Si tienes alguna pregunta o necesitas ayuda, no dudes en
            contactarnos.
          </p>
          <p>
            Email:{" "}
            <a href="mailto:" className="text-decoration-none">
              lifemanager@gmail.com
            </a>
          </p>
          <p>
            Teléfono:{" "}
            <a href="tel:" className="text-decoration-none">
              +5493412288582
            </a>
          </p>
        </div>
      </div>
      <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados." />
    </>
  );
};

export default Estudios;
