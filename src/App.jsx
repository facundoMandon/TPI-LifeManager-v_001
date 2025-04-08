import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css'; //Importa los estilos del css
import './App.css'
import {Header, Footer, TaskCard, NavBar} from './components'; //Impota los componentes de ./components
import {Ejercicio, Bienestar, Estudios, Finanzas, Tareas, Trabajo} from './sections' //Importa los componentes de ./sections que despues cambio a ./pages




function App() {
  return (
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <NavBar />
      <Header />
      <main className='container'>
        <Estudios />
        <Trabajo />
        <Ejercicio />
        <Bienestar />
        <Finanzas />
        <Tareas />
      </main>
      <Footer />
    </body>
    </html>

  );
}

export default App
