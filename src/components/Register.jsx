import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null); 
  
    
    try {
      const requestBody = { user: { name, email, password } };
  
      console.log("Enviando request:", requestBody);
  
      const response = await fetch(
        "https://mammal-excited-tarpon.ngrok-free.app/api/user/register?secret=TallerReact2025!",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        }
      );
  
      const data = await response.json();
      console.log("Respuesta de la API:", data);
  
      if (data.result === true) {
        navigate("/login"); 
      } else {
        setError("Error en el registro. Intenta nuevamente.");
      }
    } catch (error) {
      setError("Error en el servidor. Intenta más tarde.");
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="container">
      <h2>Registrarse</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-success" onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  );
};

export default Register;
