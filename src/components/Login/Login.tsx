import React, { useState } from "react";
import './Login.css';
import { Link } from "react-router-dom";
import * as API from '../../services/api';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        try {
            // Llamada a la API
            const { accessToken} = await API.login(email, password);

            // Guardar el token en sessionStorage
            sessionStorage.setItem('accessToken', accessToken);

            console.log("Login Exitoso:", { accessToken});

            // Redirigir al dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Error durante el login:', err);

            setError('Error en el inicio de sesión.');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hubo un problema durante el inicio de sesión.",
                footer: '<a href="#">¿Por qué tengo este problema?</a>',
            });
        }
    };

    return (
        <div className="form">
            <div className="form-text">
                <h3>Login</h3>
            </div>
            <form className="form-cont-campos" onSubmit={handleLogin}>
                <div className="form-cont-campo">
                    <input 
                        type="text"
                        placeholder="Correo"
                        id="correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-cont-campo">
                    <input 
                        type="password"
                        placeholder="Clave"
                        id="clave"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="form--button">Ingresar</button><br />
                <Link to="/registrarse">Registrarse</Link>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};
