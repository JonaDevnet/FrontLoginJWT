import React from "react";
 
export const Registrarse: React.FC = () => {
    return (
        <div className="form">
            <h3>Crear usuario</h3>
            <div className="form-cont-campo">
                <label htmlFor="">Nombres</label>
                <input 
                        type="text"
                        placeholder="Tu Nombre"
                        id="nombre"
                         />
            </div>
            <div className="form-cont-campo">
                <label htmlFor="">Apellidos</label>
                <input 
                        type="text"
                        placeholder="Tu Apellidos"
                        id="apellidos"
                         />
            </div>
            <div className="form-cont-campo">
                <label htmlFor="">Correo</label>
                <input 
                        type="email"
                        placeholder="Tu Correo"
                        id="correo"
                         />
            </div>
            <div className="form-cont-campo">
                <label htmlFor="">Celular</label>
                <input 
                        type="number"
                        placeholder="Tu Numero"
                        id="celular"
                         />
            </div>
            <div className="form-cont-campo">
                <label htmlFor="">Clave</label>
                <input 
                        type="password"
                        placeholder="Tu clave"
                        id="clave"
                         />
            </div>
            <button className="form--button">Guardar</button><br />
        </div>

    );
}