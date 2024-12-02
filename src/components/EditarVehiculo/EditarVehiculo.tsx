import React, { useState, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import * as API from '../../services/api';
import { useLocation, useNavigate } from "react-router-dom";
import '../Login/Login.css';
import { Nav } from '../Navigate/Nav';


interface Vehiculo {
    IdVehiculo: number,
    Tipo: string;
    Patente: string;
    Marca: string;
    Modelo: string;
    Anio: number;
}

export const EditarVehiculo: React.FC = () => {
    const location = useLocation();
    const vehiculo = location.state?.vehiculo; 
    const [vehiculoForm, setVehiculoForm] = useState<Vehiculo>(vehiculo); // Inicializamos con los datos recibidos
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();    

    // Manejar cambios en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;
    setVehiculoForm({
      ...vehiculoForm,
      [name]: name === "Anio" ? Number(value) : value, // Convertimos "Anio" a número
        });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        try {
            console.log("Datos enviados a la API:", vehiculoForm.IdVehiculo); // Verifica que los datos sean los correctos
    
            // Llama a la función para editar el vehículo
            const response = await API.EditarVehiculo(vehiculoForm);
    
            if (!response) {
                setError("Error, la respuesta es nula o inválida");
            } else {
                setError('');
                Swal.fire({
                    icon: "success",
                    title: "Actualizado con éxito",
                    text: "El vehículo se actualizó correctamente.",
                });
                navigate("/dashboard"); // Redirige al Dashboard tras la actualización
            }
        } catch (err) {
            console.error("Error al editar el vehículo:", err);
            setError("Error al intentar editar el vehículo.");
    
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hubo un problema al actualizar el vehículo.",
            });
        }
    };
    

    return (
        <div>
            <Nav/>
            <form className="form" onSubmit={handleSubmit}>
                
                <legend>Editar Vehículo</legend>
                <div className="form-cont-campos">
                    {["Tipo", "Patente", "Marca", "Modelo", "Anio"].map((campo) => (
                    <div className="form-cont-campo" key={campo}>
                        <label>{campo}</label>
                        <input
                        type="text"
                        placeholder={`Ingrese ${campo.toLowerCase()}`}
                        name={campo}
                        value={vehiculoForm[campo as keyof Vehiculo].toString()} // Convertimos el valor a string para el input
                        onChange={handleChange}
                        required
                        />
                    </div>
                    ))}
                </div>

                <button className="form--button" type="submit">Guardar Cambios</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};
