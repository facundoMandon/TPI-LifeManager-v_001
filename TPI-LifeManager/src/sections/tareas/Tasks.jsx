import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:4000/tasks";

const Tasks = () => {
  const { id: sectionId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    initDate: "",
    endDate: "",
    content: ""
  });

  useEffect(() => {
    fetch(`${API_URL}`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(task => task.sectionId == sectionId);
        setTasks(filtered);
      });
  }, [sectionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sectionId })
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setForm({ title: "", description: "", initDate: "", endDate: "", content: "" });
    } else {
      console.error("Error al crear tarea");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("¿Seguro que querés eliminar esta tarea?")) return;

    const res = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setTasks(tasks.filter(t => t.id !== taskId));
    } else {
      console.error("Error al eliminar");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Lista de tareas */}
        <div className="col-6">
          <h3>Tareas</h3>
          <ul className="list-group mb-4">
            {tasks.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{task.title}</strong><br />
                  <small>{task.initDate?.slice(0, 10)} - {task.endDate?.slice(0, 10)}</small>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>Eliminar</button>
              </li>
            ))}
          </ul>

          {/* Formulario de nueva tarea */}
          <h5>Agregar nueva tarea</h5>
          <form onSubmit={handleSubmit}>
            <input className="form-control mb-2" name="title" value={form.title} onChange={handleInputChange} placeholder="Título" required />
            <input className="form-control mb-2" name="description" value={form.description} onChange={handleInputChange} placeholder="Descripción" required />
            <input className="form-control mb-2" type="date" name="initDate" value={form.initDate} onChange={handleInputChange} required />
            <input className="form-control mb-2" type="date" name="endDate" value={form.endDate} onChange={handleInputChange} />
            <textarea className="form-control mb-2" name="content" value={form.content} onChange={handleInputChange} placeholder="Contenido extra (notas)"></textarea>
            <button className="btn btn-primary" type="submit">Agregar tarea</button>
          </form>
        </div>

        {/* Calendario simple */}
        <div className="col-6 ps-4">
          <h3>Calendario</h3>
          <ul className="list-group">
            {tasks.map(task => (
              <li key={task.id} className="list-group-item">
                📅 <strong>{task.title}</strong><br />
                <small>{task.initDate?.slice(0, 10)} → {task.endDate?.slice(0, 10) || "Sin fin"}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

  );
};


export default Tasks;
