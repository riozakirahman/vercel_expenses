import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LoggedContext } from "../../contexts/LoggedContext";

const Login = () => {
  const { auth, setAuth } = useContext(LoggedContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/api/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.token);
      setAuth({ token: true });
      return <Navigate to={"/"} />;
    } else {
      setAuth({ token: null });
      console.log("Wrong credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Card
        style={{
          width: 400,
        }}
      >
        <h1 style={{ marginBottom: 40 }}>Login</h1>
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "start",
              width: "100%",
            }}
          >
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              aria-describedby="username-help"
              className="p-inputtext-sm"
              style={{ width: "100%" }}
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "start",
              width: "100%",
            }}
          >
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              required
              className="p-inputtext-sm"
              feedback={false}
              toggleMask
              aria-describedby="password"
              style={{ width: "100%" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button label="Submit" type="Submit" style={{ width: "100%" }} />
        </form>
      </Card>
    </div>
  );
};

export default Login;
