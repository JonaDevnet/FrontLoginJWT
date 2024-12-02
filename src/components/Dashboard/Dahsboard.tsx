import React, { useCallback, useEffect, useState } from 'react';
import './Dashboard.css'
import * as API from '../../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { MdDeleteForever } from "react-icons/md";
import { BsFillStickyFill } from "react-icons/bs";
import { Nav } from '../Navigate/Nav';

interface Vehiculo {
  IdVehiculo: number;
  Tipo: string;
  Patente: string;
  Marca: string;
  Modelo: string;
  Anio: number;
}

export const Dashboard: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Función para cargar los vehículos
  const fetchVehiculos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await API.getVehiculos();
      const vehiculosMapeados = data.value.map((v: any) => ({
        IdVehiculo: v.idVehiculo,
        Tipo: v.tipo,
        Patente: v.patente,
        Marca: v.marca,
        Modelo: v.modelo,
        Anio: v.anio,
      }));
      setVehiculos(vehiculosMapeados);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleNuevoehiculo = () => {
    navigate('/nuevovehiculo');
  }
  const handleEditarVehiculo = ( vehiculo: Vehiculo) => {
    console.log(vehiculo)
    navigate('/editarvehiculo', {state: {vehiculo}});
  }

  const handleEliminarVehiculo = (id: number) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el vehículo permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await API.EliminarVehiculo(id);
                
                if (!response) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salió mal al eliminar el vehículo.',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El vehículo fue eliminado correctamente.',
                    });
                    console.log('Vehículo eliminado');
                    setError(''); 
                    await fetchVehiculos(); // recargamos la tabla
                }
            } catch (error) {
                console.error('No se pudo eliminar', error);
                setError('No se pudo eliminar');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal.',
                });
            }
        } else {
            console.log('Eliminación cancelada');
        }
    });
  };


  return (  
    <div className='dashboard'>
      <Nav/>
      <h1>Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Cargando vehículos...</p>}
      {!loading && vehiculos.length === 0 && <p>No se encontraron vehículos.</p>}
      {!loading && vehiculos.length > 0 && (
        <TableContainer className='dashboard--table'  component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de vehículos">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Tipo</TableCell>
                <TableCell align="right">Patente</TableCell>
                <TableCell align="right">Marca</TableCell>
                <TableCell align="right">Modelo</TableCell>
                <TableCell align="right">Año</TableCell>
                <TableCell>Eliminar</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehiculos.map((vehiculo) => (
                <TableRow               
                  key={vehiculo.IdVehiculo}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {vehiculo.IdVehiculo}
                  </TableCell>
                  <TableCell align="right">{vehiculo.Tipo}</TableCell>
                  <TableCell align="right">{vehiculo.Patente}</TableCell>
                  <TableCell align="right">{vehiculo.Marca}</TableCell>
                  <TableCell align="right">{vehiculo.Modelo}</TableCell>
                  <TableCell align="right">{vehiculo.Anio}</TableCell>
                  <TableCell onClick={() => handleEliminarVehiculo(vehiculo.IdVehiculo)}><MdDeleteForever color="red" size={25} cursor='pointer'/></TableCell>
                  <TableCell onClick={() => handleEditarVehiculo(vehiculo)}><BsFillStickyFill size={20} cursor='pointer'/></TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <button className='form--button' onClick={handleNuevoehiculo}>Nuevo Vehiculo</button>
    </div>
  );
};
