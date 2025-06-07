import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components";
import { Form, Button, ListGroup } from "react-bootstrap";

// URL del backend (asegúrate que sea correcto)
const API_URL = "http://localhost:4000/sections";

const Estudios = () => {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Suponemos que tenés un userId (puede venir de contexto o localStorage)
  const userId = 1;

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/${userId}`);
const data = await res.json();
setSections(data);

    } catch (e) {
      console.error("Error al obtener las secciones", e);
      setSections([]);
    }
    setLoading(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Este campo es obligatorio";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const body = {
      name: form.name.trim(),
      userId,
    };

    try {
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

      setForm({ name: "" });
      setEditId(null);
      setErrors({});
      fetchSections();
    } catch (error) {
      console.error("Error al guardar la sección", error);
    }
  };

  const handleEdit = (section) => {
    setForm({ name: section.name });
    setEditId(section.id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchSections();
    } catch (error) {
      console.error("Error al eliminar la sección", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container text-white">
      <h1 className="text-center my-4">Estudios</h1>
      <p className="text-center">
        Aquí puedes gestionar tus estudios (secciones).
      </p>

      <div className="row">
        <div className="col-md-6">
          <h2>{editId ? "Editar Estudio" : "Agregar Estudio"}</h2>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Estudio</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary">
              {editId ? "Guardar Cambios" : "Agregar"}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="secondary"
                className="ms-2"
                onClick={() => {
                  setForm({ name: "" });
                  setEditId(null);
                  setErrors({});
                }}
              >
                Cancelar
              </Button>
            )}
          </Form>
        </div>

        <div className="col-md-6">
          <h2>Lista de Estudios</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ListGroup variant="flush">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <ListGroup.Item
                    key={section.id}
                    action
                    onClick={() => navigate(`/estudios/${section.id}/tasks`)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>{section.name}</div>
                    <div>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(section);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(section.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted">No hay estudios cargados.</p>
              )}
            </ListGroup>
          )}
        </div>
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
    </div>
  );
};

export default Estudios;
