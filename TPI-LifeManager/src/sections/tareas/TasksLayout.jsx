import { Outlet, useParams } from "react-router-dom";
import { Footer, Header } from "../../components";

const TasksLayout = () => {
  return (
    <div>
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados." />
    </div>
  );
};

export default TasksLayout;
