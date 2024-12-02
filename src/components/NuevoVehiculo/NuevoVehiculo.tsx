import React, { useState } from "react";
import * as API from '../../services/api';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { Nav } from '../Navigate/Nav';


export const NuevoVehiculo: React.FC = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [vehiculos, setVehiculos] = useState({
        Tipo: '',
        Patente: '',
        Marca: '',
        Modelo: '',
        Anio: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVehiculos((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleNuevoVehiculo = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (
            !vehiculos.Tipo.trim() ||
            !vehiculos.Patente.trim() ||
            !vehiculos.Marca.trim() ||
            !vehiculos.Modelo.trim() ||
            !vehiculos.Anio.trim() ||
            isNaN(parseInt(vehiculos.Anio))
        ) {
            setError('Todos los campos deben completarse correctamente.');
            return;
        }

        const vehiculoRequest = {
            ...vehiculos,
            Anio: parseInt(vehiculos.Anio),
        };

        try {
            const response = await API.nuevovehiculo(vehiculoRequest);
            console.log('Respuesta del registro:', response);


            if (response) {
                setError('');
                setVehiculos({
                    Tipo: '',
                    Patente: '',
                    Marca: '',
                    Modelo: '',
                    Anio: '',
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Creado con éxito',
                    text: 'Se creó correctamente el vehículo.',
                });
                await navigate('/dashboard');
            }
        } catch (err) {
            console.error('Error al registrar el vehículo:', err);
            setError('Error al registrar el vehículo.');

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal con la creación del vehículo.',
                footer: '<a href="#">¿Por qué tengo este problema?</a>',
            });
        }
    };

    return (
        <div>
            <Nav/>
            <form className="form" onSubmit={handleNuevoVehiculo}>
                    <legend>Nuevo Vehículo</legend>
                    <div className="form-cont-campos">
                        {["Tipo", "Patente", "Marca", "Modelo", "Anio"].map((campo) => (
                            <div className="form-cont-campo" key={campo}>
                                <label>{campo}</label>
                                <input
                                    type="text"
                                     placeholder={`Ingrese ${campo.toLowerCase()}`}
                                    name={campo}
                                    value={(vehiculos as any)[campo]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                <button className="form--button" type="submit">Agregar</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};
