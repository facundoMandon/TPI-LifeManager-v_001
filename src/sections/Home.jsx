import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { TaskCard } from '../components';
import Estudios from './estudios/Estudios';
const Home = () => {
    return (
      <div className="container mt-4">
        <Header></Header>
        <h1>Bienvenido a tu organizador de vida</h1>
        <p>Elegí una sección para comenzar: estudios, trabajo o ejercicio.</p>
        <main>
          <div className="d-flex flex-wrap gap-4 justify-content-center p-4 taskcard-img-size">
            <TaskCard 
              bgClass="taskcard-bg-yellow"
              title="Estudios"
              description="Cacahuate"
              path="/Estudios"
              imgSrc="/img/libro.jpg"/>

            <TaskCard 
              bgClass="taskcard-bg-orange"
              title="Ejercicio"
              description="Cacahuate"
              path="/Ejercicio"
              imgSrc="/img/ejercicio.jpg"/>

            <TaskCard 
              bgClass="taskcard-bg-aqua"
              title="Bienestar"
              description="Cacahuate"
              path="/Bienestar"
              imgSrc="/img/bienestar.jpg"/>

            <TaskCard 
              bgClass="taskcard-bg-red"
              title="Trabajo"
              description="Cacahuate"
              path="/Trabajo"
              imgSrc="/img/trabajo.jpg"/>
          </div>
          
        </main>
        <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados."/>
      </div>
      
    );
  };
  
  export default Home;
  