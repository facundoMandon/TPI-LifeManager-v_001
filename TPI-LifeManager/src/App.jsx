import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
<<<<<<< HEAD
import { Estudios, Trabajo } from "./sections";
=======
import { Ejercicio, Estudios, Trabajo } from "./sections";
>>>>>>> 75f8a88df3559bb996e023b38894dec0910661b6
import Login from "./sections/login/login.jsx";
import Register from "./sections/register/register.jsx";
import Home from "./sections/Home";
import TasksLayout from "./sections/tareas/TasksLayout.jsx";
import Tasks from "./sections/tareas/Tasks.jsx";
import CreateTask from "./sections/tareas/create_tasks.jsx";
import Header from "./components/Header.jsx";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/protectedRoutes.jsx"; // Importar el componente ProtectedRoute
import NotFound from "./components/NotFound.jsx"; // Importar el componente NotFound

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
      import ProtectedRoute from "./components/ProtectedRoute"; // ...
      <Routes>
<<<<<<< HEAD
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudios"
          element={
            <ProtectedRoute>
              <Estudios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudios/:id/tareas"
          element={
            <ProtectedRoute>
              <TasksLayout />
            </ProtectedRoute>
          }
        >
=======
        <Route path="/" element={<Home />} />
        <Route path="/estudios" element={<Estudios />} />
        <Route path="/estudios/:id/tasksEst" element={<TasksLayout />}>
>>>>>>> 75f8a88df3559bb996e023b38894dec0910661b6
          <Route index element={<Tasks />} />
          <Route
            path="crear"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/trabajo"
          element={
            <ProtectedRoute>
              <Trabajo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajo/:id/tareas"
          element={
            <ProtectedRoute>
              <TasksLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Tasks />} />
          <Route
            path="crear"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
        </Route>
<<<<<<< HEAD

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
=======
        <Route path="/ejercicio" element={<Ejercicio />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
>>>>>>> 75f8a88df3559bb996e023b38894dec0910661b6
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
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
