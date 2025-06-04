import NavBar from "./NavBar";
import Canvas from "./OffCanvas";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="header-container">
      <Canvas className="offcanvas-container" />
      <div className="icono-header">
        <img src="/img/lifemanager-icon.png" alt="Icono del sitio" />
        <h1>LifeManager</h1>
      </div>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default Header;
