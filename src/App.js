import logo from "./logo.svg";
import "./App.css";
import { useState, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./components/Layout";
import { LoggedContext } from "./contexts/LoggedContext";
import Login from "./components/Login/Login";
import { Button } from "primereact/button";
function App() {
  const { auth, setAuth } = useContext(LoggedContext);

  const handleClick = () => {
    localStorage.setItem("token", "123");
  };
  return (
    <div className="App">
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/about" element={<Layout />}>
            <Route index element={<h1>About</h1>}></Route>
          </Route>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <div>
                  <h1>Home</h1>
                  <Button label="Change Token" onClick={handleClick} />
                </div>
              }
            ></Route>
          </Route>
        </Route>
        <Route path="*" element={<h1>404</h1>} />
        <Route
          path="/login"
          element={
            auth.token !== true && auth.token == null ? (
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
