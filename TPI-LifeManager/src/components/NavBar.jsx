import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // o "user", según lo que hayas guardado
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg" data-bs-theme="dark">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Secciones
              </a>
              <div className="dropdown-menu">
                <Link className="dropdown-item" to="/estudios">
                  Estudios
                </Link>
                <Link className="dropdown-item" to="/trabajo">
                  Trabajo
                </Link>
                <div className="dropdown-divider"></div>
              </div>
            </li>
          </ul>

          <form className="d-flex flex-column flex-lg-row ms-lg-auto gap-2 mt-2 mt-lg-0">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              style={{ minWidth: "50px", width: "150px", flex: "1 1 300px" }}
            />
            <button className="btn btn-secondary" type="submit">
              <img
                className="navbar-lupa"
                src="../public/img/lupa.png"
                alt="lupa"
              />
            </button>
          </form>

          <div className="d-flex flex-wrap ms-lg-3 mt-2 mt-lg-0 gap-1">
            {!isLoggedIn ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/login" style= { {minWidth: "100%"}}>
                  Login
                </Link>
                <Link className="btn btn-primary" to="/register" style= { {minWidth: "100%"}} >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-success me-2" to="/perfil">
                  Profile  
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
