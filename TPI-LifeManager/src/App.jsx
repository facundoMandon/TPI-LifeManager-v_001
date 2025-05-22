import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'; //Importa las rutas para moverme entre componentes
import 'bootstrap/dist/css/bootstrap.min.css'; //Importa los estilos del css
import './App.css'
import {Ejercicio, Bienestar, Estudios, Trabajo} from './sections' //Importa los componentes de ./sections que despues cambio a ./pages
import Home from './sections/Home';


function App() {
  return (

    <BrowserRouter>
      <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/estudios" element={<Estudios/>} />
            <Route path="/trabajo" element={<Trabajo/>} />
            <Route path="/bienestar" element={<Bienestar/>} />
            <Route path="/ejercicio" element={<Ejercicio/>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App
