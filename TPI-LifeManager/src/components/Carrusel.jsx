import React from 'react';
import { Carousel } from 'react-bootstrap';

const Carrusel = () => {
    return  (
    <Carousel className="h-100 w-100" interval={3000} fade>
      <Carousel.Item>

        <img
          className="d-block w-100 h-max-800"
          src="/public/img/carrusel (1).jpg"
          alt="First slide"
        />
        <Carousel.Caption className="d-flex d-flex-column justify-content-center align-items-center h-100"> 
          <h1>Bienvenido a Life Manager</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 h-max-800"
          src="/public/img/carrusel (1).jpg"
          alt="Second slide"
        />
        <Carousel.Caption className="d-flex d-flex-column justify-content-center align-items-center h-100"> 
          <h1>Organiza tu vida</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 h-max-800"
          src="/public/img/carrusel (1).jpg"
          alt="Third slide"
        />
<Carousel.Caption className="d-flex d-flex-column justify-content-center align-items-center h-100"> 
          <h1>Gestiona tus tareas</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>

        <img
          className="d-block w-100 h-max-800"
          src="/public/img/carrusel (1).jpg"
          alt="First slide"
        />
        <Carousel.Caption className="d-flex d-flex-column justify-content-center align-items-center h-100"> 
          <h1 className=''>Aprovecha tu tiempo</h1>
        </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
};

export default Carrusel;