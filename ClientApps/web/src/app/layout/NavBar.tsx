import { NavLink } from "react-router";

export default function NavBar() {
  const closeMenu = () => {
    const el = document.getElementById("navbarNavDropdown");
    if (el?.classList.contains("show")) {
      el.classList.remove("show");
    }
  };


  return (
    <>
        <nav className="navbar navbar-expand-lg shadow-sm navbar-light">
      <div className="container-fluid ps-0">
        <NavLink className="navbar-brand" to="/home">
          <img src="/images/CCRemodelingLogo2_t.png" alt="" width="300" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto nav-separator">
            <li className="nav-item">
              <NavLink to="/home" className="nav-link" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className="nav-link" onClick={closeMenu}>
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/gallery" className="nav-link" onClick={closeMenu}>
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contactUs" className="nav-link" onClick={closeMenu}>
                Contact Us
              </NavLink>
            </li>            
          </ul>
        </div>
      </div>
    </nav>
    <div className="my-0"></div>
    </>
  )
}