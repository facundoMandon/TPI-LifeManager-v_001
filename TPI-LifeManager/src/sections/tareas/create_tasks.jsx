import { useParams } from "react-router-dom";
import { useState } from "react";

const CreateTask = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/projects/${id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    // Redirigir o limpiar el formulario
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2>Crear nueva tarea</h2>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          className="form-control"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">Crear</button>
    </form>
  );
};

export default CreateTask;
