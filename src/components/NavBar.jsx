import { Link } from "react-router-dom";

const NavBar = () => {
    return (<nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
                 <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Secciones</a>
              <div className="dropdown-menu">
                 <Link className="dropdown-item" to="/estudios">Estudios</Link>
                 <Link className="dropdown-item" to="/trabajo">Trabajo</Link>
                 <Link className="dropdown-item" to="/bienestar">Bienestar</Link>
                 <Link className="dropdown-item" to="/ejercicio">Ejercicio</Link>
               <div className="dropdown-divider"></div>
              </div>
            </li>
          </ul>
          <form className="d-flex">
            <input className="form-control me-sm-2" type="search" placeholder="Search"/>
            <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>)
}

export default NavBar;