// src/App.jsx
import Navbar from "./components/Navbar/Navbar";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import AddFood from "./components/AddFood";
import DeleteFood from "./components/DeleteFood";
import Register from "./components/LoginRegister/Register";
import LoginUser from "./components/LoginRegister/LoginUser";
import AllFood from "./components/AllFood";
import Admin from "./components/Admin";
import UserInfo from "./components/UserInfo";
import MealManagement from "./components/MealManagement";
import Home from "./components/HomePage/Home";
import "./App.css";
import Footer from "./components/Footer/Footer";
import GetUser from "./components/GetUser"
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");

 

  return (
    <Router>
      <Navbar />
      <div>
         <nav>
          <ul>
            <li>
              <Link to="/home">Strona głowna</Link>
            </li>
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
                <Link to="/info">Informacje o użytkowniku</Link>
              </li>
            )}
          </ul>
        </nav> 
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/MealsManagement"
            element={role === "user" ? <MealManagement /> : <Navigate to="/" />}
          />
          <Route
            path="/AddFood"
            element={role === "user" ? <AddFood /> : <Navigate to="/" />}
          />
          <Route
            path="/AllFood"
            element={role === "admin" ? <AllFood /> : <Navigate to="/" />}
          />
          <Route
            path="/DeleteFood"
            element={role === "admin" ? <DeleteFood /> : <Navigate to="/" />}
          />
          <Route
            path="/admin"
            element={role === "admin" ? <Admin /> : <Navigate to="/" />}
          />
            <Route
            path="/GetUser"
            element={role === "admin" ? <GetUser /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={
              <LoginUser
                setToken={setToken}
                setUsername={setUsername}
                setRole={setRole}
              />
            }
          />{" "}
          <Route path="/signup" element={<Register />} />
          <Route
            path="/info"
            element={role === "user" ? <UserInfo /> : <Navigate to="/" />}
          />
        </Routes>
        {/* <div>
          {token ? (
            <div>
              <h2>Dzień dobry, {username}!</h2>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <Register />
              <LoginUser
                setToken={setToken}
                setUsername={setUsername}
                setRole={setRole}
              />
            </div>
          )}
        </div> */}
      </div>
      <Footer />
    </Router>
  );
}

export default App;
