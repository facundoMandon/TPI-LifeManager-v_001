import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Ejercicio, Estudios, Trabajo } from "./sections";
import Login from "./sections/login/login.jsx";
import Register from "./sections/register/register.jsx";
import Home from "./sections/Home";
import TasksLayout from "./sections/tareas/TasksLayout.jsx";
import Tasks from "./sections/tareas/Tasks.jsx";
import CreateTask from "./sections/tareas/create_tasks.jsx";
import Header from "./components/Header.jsx";
import { useState, useEffect } from "react";

const AppContent = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && (
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estudios" element={<Estudios />} />
        <Route path="/estudios/:id/tasksEst" element={<TasksLayout />}>
          <Route index element={<Tasks />} />
          <Route path="crear" element={<CreateTask />} />
        </Route>
        <Route path="/trabajo" element={<Trabajo />} />
        <Route path="/trabajo/:id/tareas" element={<TasksLayout />}>
          <Route index element={<Tasks />} />
          <Route path="crear" element={<CreateTask />} />
        </Route>
        <Route path="/ejercicio" element={<Ejercicio />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
