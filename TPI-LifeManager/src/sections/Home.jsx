import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { TaskCard } from '../components';
import Carrusel from '../components/Carrusel';
import taskCardsData from '../components/TaskCardData';
const Home = () => {
    return (
      <div className="container mt-4">
        <Carrusel/>
        <main>
          <div className="d-flex flex-wrap gap-4 justify-content-center p-4 taskcard-img-size">
            {taskCardsData.map((card) => (
              <TaskCard
                key={card.id}
                bgClass={card.bgClass}
                title={card.title}
                description={card.description}
                path={card.path}
                imgSrc={card.imgSrc}
                />
            ))}
          </div>
          
        </main>
        <Footer texto="© 2025 Mi Organizador. Todos los derechos reservados."/>
      </div>
      
    );
  };
  
  export default Home;
  