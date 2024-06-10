import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ token, username, role }) => {
  token = localStorage.getItem("token");
  role = localStorage.getItem("role");
  username = localStorage.getItem("username");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.reload(false);
  };
  return (
    <div className="navbaro">
      <nav className="navbar">
        <div className="navdiv">
          <div className="logo">
            <NavLink to="/home">Home</NavLink>
          </div>
          <div className="nav-items">
            <ul>
              {role === "user" && (
                <li>
                  <Link to="/MealsManagement">Menu</Link>
                </li>
              )}
              {role === "user" && (
                <li>
                  <Link to="/AddFood">Dodaj produkt</Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link to="/DeleteFood">Usuwanie produktów</Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link to="/AllFood">Lista produktów</Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link to="/GetUser">Lista użytkowników</Link>
                </li>
              )}
              {role === "user" && (
                <li>
                  <Link to="/info">Profil</Link>
                </li>
              )}

              <li>
                <NavLink to="/home">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">O nas</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Kontakt</NavLink>
              </li>
            </ul>
            {token ? (
              <div className="auth-section">
                <span className="username">{username}!</span>
                <button onClick={handleLogout} className="login-button">
                  Wyloguj
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="login-button">
                Zaloguj
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
