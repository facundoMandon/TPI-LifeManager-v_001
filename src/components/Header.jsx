import NavBar from './NavBar';
import Canvas from './OffCanvas';

const Header = () => {

    return (
        <div className="header-container">
            <Canvas/>
            <div className="icono-header">
                <img src="/img/lifemanager-icon.png" alt="Icono del sitio" />
                <h1>LifeManager</h1>
            </div>
            <NavBar className="navBar-header"></NavBar>
        </div>
    );
};

export default Header;