import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UseAuth";

export default function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ExpenseTracker
        </Link>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">
                    Categorías
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transactions">
                    Transacciones
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 text-white">
            {isAuthenticated && <span>{user?.name}</span>}

            {isAuthenticated ? (
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Salir
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light btn-sm" to="/register">
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}