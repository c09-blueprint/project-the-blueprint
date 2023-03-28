import "./navbar.css";

const NavbarHome = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark menubar">
      <a className="navbar-brand mb-0 h1 bp-logo" href="#">
        Blueprint
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto menu-item-padding">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarHome;
