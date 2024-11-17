import React from "react";
import './Login.css';

export const Login: React.FC = () => {
    return (
        
        <div className="form">
            <div className="form-text">
                <h3>Login</h3>
            </div>
            <form className="form-cont-campos">
                <div className="form-cont-campo">
                    <input 
                        type="text"
                        placeholder="Correo"
                        id="correo"
                         />
                </div>
                <div className="form-cont-campo">
                    <input 
                        type="password"
                        placeholder="Clave"
                        id="clave"
                         />
                </div>
                <button className="form--button">Ingresar</button><br />
                <a href="#">Registrarse</a>
            </form>
        </div>
    )
};