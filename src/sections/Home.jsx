import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
const Home = () => {
    return (
      <div className="container mt-4">
        <Header></Header>
        <h1>Bienvenido a tu organizador de vida</h1>
        <p>Elegí una sección para comenzar: estudios, trabajo o ejercicio.</p>
        <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados."/>
      </div>
      
    );
  };
  
  export default Home;
  