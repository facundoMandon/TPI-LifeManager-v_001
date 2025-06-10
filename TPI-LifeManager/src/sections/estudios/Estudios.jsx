import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components";
import { Form, Button, ListGroup } from "react-bootstrap";

// URL del backend
const API_URL = "http://localhost:4000/sections";

const Estudios = () => {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // Para almacenar el rol del usuario
  const [currentUserId, setCurrentUserId] = useState(null); // Para almacenar el ID del usuario actual

  const navigate = useNavigate();

  // Función para obtener el token y el ID/rol del usuario
  const getAuthData = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // Asumimos que el objeto user se guarda aquí

    // Si no hay token o user, redirige a login
    if (!token || !user || !user.id || !user.rol) {
      console.warn("No hay token o datos de usuario, redirigiendo a login.");
      navigate("/login"); // Asumiendo que "/login" es tu ruta de login
      return { token: null, userId: null, userRole: null };
    }

    return { token, userId: user.id, userRole: user.rol };
  };

  useEffect(() => {
    // Al cargar el componente, obtener el rol y ID del usuario
    const { userId, userRole } = getAuthData();
    setCurrentUserId(userId);
    setUserRole(userRole);

    // Las secciones ahora son generales, no necesitamos pasar userId
    fetchSections(); // <-- Llamada sin userId
  }, []);

  const fetchSections = async () => { // <-- Ya no recibe userIdToFetch como argumento
    setLoading(true);
    const { token } = getAuthData(); // Obtener el token antes de la petición

    if (!token) { // Si no hay token, no proceder
      setLoading(false);
      return;
    }

    try {
      // --- CAMBIO CLAVE AQUÍ: La URL ahora es solo la base de secciones ---
      const res = await fetch(`${API_URL}`, { // <-- Ruta para obtener TODAS las secciones
        headers: {
          Authorization: `Bearer ${token}`, // <-- ¡Header de autorización aquí!
        },
      });

      if (res.status === 401) { // Si token inválido o expirado
        alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        navigate("/login");
        return;
      }
      if (res.status === 403) { // Si autenticado, pero sin permisos para ver la información (menos común para listado general)
        alert("No tienes permiso para ver esta información.");
        setSections([]); // Limpia las secciones si no tiene permiso para verlas
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener las secciones");

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

    // Asegurarse de que solo los administradores puedan crear/editar secciones
    if (userRole !== "admin" && userRole !== "superadmin") {
      alert("Solo los administradores o superadministradores pueden crear/editar secciones.");
      return;
    }

    const { token } = getAuthData(); // Obtener el token
    if (!token) return; // Si no hay token, no proceder

    const body = {
      name: form.name.trim(),
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <-- Header de autorización
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <-- Header de autorización
          },
          body: JSON.stringify(body),
        });
      }

      if (res.status === 401) { // Token inválido o expirado
        alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        navigate("/login");
        return;
      }
      if (res.status === 403) { // Autenticado, pero sin permisos para esta acción
        alert("No tienes permiso para realizar esta acción.");
        return;
      }

      if (!res.ok) throw new Error("Error al guardar la sección");

      const savedSection = await res.json();

      if (editId) {
        setSections((prev) =>
          prev.map((s) => (s.id === editId ? savedSection : s))
        );
      } else {
        setSections((prev) => [...prev, savedSection]);
      }

      setForm({ name: "" });
      setEditId(null);
      setErrors({});
      fetchSections(); // <-- Refrescar la lista de secciones generales
    } catch (error) {
      console.error("Error al guardar la sección", error);
    }
  };

  const handleEdit = (section) => {
    // Solo permitir editar si el usuario es admin o superadmin
    if (userRole !== "admin" && userRole !== "superadmin") {
      alert("Solo los administradores o superadministradores pueden editar secciones.");
      return;
    }
    setForm({ name: section.name });
    setEditId(section.id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    // Restricción para eliminar solo por superadmin
    if (userRole !== "superadmin") {
      alert("Solo los superadministradores pueden eliminar secciones.");
      return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar esta sección?")) return;

    const { token } = getAuthData();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) { // Token inválido o expirado
        alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        navigate("/login");
        return;
      }
      if (res.status === 403) { // Autenticado, pero sin permisos para esta acción
        alert("No tienes permiso para realizar esta acción.");
        return;
      }

      if (!res.ok) throw new Error("Error al eliminar la sección");

      fetchSections();
    } catch (error) {
      console.error("Error al eliminar la sección", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container text-white min-vh-100">
      <h1 className="text-center my-4">Estudios</h1>
      <p className="text-center">
        Aquí puedes gestionar tus estudios (secciones).
      </p>

      <div className="row">
        {/* Renderizado condicional del formulario de agregar/editar estudios */}
        {(userRole === "admin" || userRole === "superadmin") && (
          <div className="col-md-6 mb-4">
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
                  // El `disabled` aquí es redundante si todo el div se oculta, pero no hace daño
                  disabled={userRole !== "admin" && userRole !== "superadmin"}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                // El `disabled` aquí es redundante si todo el div se oculta, pero no hace daño
                disabled={userRole !== "admin" && userRole !== "superadmin"}
              >
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
        )}

        {/* La columna de la lista de estudios siempre se muestra */}
        {/* CLASE DINÁMICA: Si es admin/superadmin, ocupa 6 columnas. Si es 'usuario', ocupa 8 y se centra. */}
        <div className={
          (userRole === "admin" || userRole === "superadmin")
            ? "col-md-6 mb-4"
            : "col-12 col-md-8 mx-auto mb-4" // col-12 para pantallas pequeñas, col-md-8 y centrado para medianas/grandes
        }>
          <h2>Lista de Estudios</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ListGroup variant="flush">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <ListGroup.Item
                    key={section.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div
                      style={{ cursor: "pointer", flexGrow: 1 }}
                      onClick={() => navigate(`/estudios/${section.id}/tasksEst`)}
                    >
                      <div>{section.name}</div>
                    </div>
                    <div>
                      {/* Botón de Editar: visible solo para admin/superadmin */}
                      {(userRole === "admin" || userRole === "superadmin") && (
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
                      )}
                      {/* Botón de Eliminar: visible solo para superadmin */}
                      {userRole === "superadmin" && (
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
                      )}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted">No hay estudios cargados.</p>
              )}
            </ListGroup>
          )}
        </div>
        {/* Los divs de información adicional no necesitan cambios de seguridad aquí */}
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
            <a href="mailto:lifemanager@gmail.com" className="text-decoration-none">
              lifemanager@gmail.com
            </a>
          </p>
          <p>
            Teléfono:{" "}
            <a href="tel:+5493412288582" className="text-decoration-none">
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
