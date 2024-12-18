import React, { useState } from "react";
import * as API from '../../services/api';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';


export const Registrarse: React.FC = () => {
    const navigate = useNavigate();


    const [usuario, setUsuario] = useState({
        Nombres: '',
        Apellidos: '',
        Correo: '',
        Celular: '',
        Clave: ''
    });
    const [error, setError] = useState('');

    // Maneja el cambio de los valores en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuario((prevState) => ({
            ...prevState, // mantenemos los valores anteriores
            [name]: value,
        }));
    };

    const handleRegistrarse = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
    
        // Validación de los campos
        if (!usuario.Nombres.trim() || !usuario.Apellidos.trim() || !usuario.Correo.trim() || !usuario.Celular || !usuario.Clave.trim()) {
            setError('Todos los campos son requeridos.');
            return; // Detiene la ejecución si hay campos vacíos
        }
    
        // Convirtiendo Celular a número
        const usuarioRequest = {
            ...usuario,
            Celular: parseInt(usuario.Celular), // Convertir el celular a número
        };
    
        try {
            console.log('Iniciando registro del usuario...');
    
            const response = await API.registrarse(usuarioRequest);
    
            console.log('Respuesta del registro:', response);
    
            if (response) {
                console.log('Usuario registrado exitosamente.');
                setError(''); // Limpiar mensajes de error
    
                // Limpiar los campos del formulario
                setUsuario({
                    Nombres: '',
                    Apellidos: '',
                    Correo: '',
                    Celular: '',
                    Clave: '',
                });
    
                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'El usuario ha sido registrado correctamente.',
                });
                navigate('/dashboard');
            } else {
                throw new Error('No se pudo registrar el usuario.');
            }
        } catch (err) {
            console.error('Error al registrar el usuario:', err);
            setError('Error al registrar el usuario.');
    
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal con la creación del usuario.',
                footer: '<a href="#">¿Por qué tengo este problema?</a>',
            });
        }
    };
    

    return (
        <form className="form" onSubmit={handleRegistrarse}>
            <h3>Crear usuario</h3>
            <div className="form-cont-campos">
                {["Nombres", "Apellidos", "Correo", "Celular"].map((campo) =>
                    <div className="form-cont-campo" key={campo}>
                        <label>{campo}</label>
                        <input
                            type="text"
                            placeholder={`Ingrese ${campo.toLowerCase()}`}
                            name={campo}
                            value={(usuario as any)[campo]}
                            onChange={handleChange}
                            required
                        />

                    </div>
                )}
                <div className="form-cont-campo">
                    <label htmlFor="">Clave</label>
                    <input
                        type="password"
                        placeholder="Tu clave"
                        id="clave"
                        name="Clave"
                        value={usuario.Clave}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>

            <button className="form--button" type="submit">Guardar</button><br />
            {error && <p>{error}</p>}
        </form>
    );
};
