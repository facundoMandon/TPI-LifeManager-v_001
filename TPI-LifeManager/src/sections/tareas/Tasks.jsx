import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Tasks = () => {
  const { id } = useParams(); // puede ser proyectoId o id, según tu ruta
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`/api/projects/${id}/tasks`);
      const data = await response.json();
      setTasks(data);
    };
    if (id) fetchTasks();
  }, [id]);

  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center p-4">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.description}</p>
              {/* Otros datos si querés */}
            </div>
          </div>
        ))
      ) : (
        <p>No hay tareas para este proyecto.</p>
      )}
    </div>
  );
};

export default Tasks;
