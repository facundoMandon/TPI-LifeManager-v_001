import { useParams } from "react-router-dom";
import { useState } from "react";

const CreateTask = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/estudios/${id}/tasksEst`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      setForm({ title: "", description: "" }); // Limpiar el formulario
      // Opcional: redirigir al usuario
    } else {
      // Manejar error
      alert("Error al crear la tarea");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          name="description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">Crear</button>
    </form>
  );
};

export default CreateTask;
