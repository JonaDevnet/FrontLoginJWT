import React, { useEffect, useState } from 'react';
import * as API from '../../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './Dashboard.css'

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

  useEffect(() => {
    const fetchVehiculos = async () => {
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
    };

    fetchVehiculos();
  }, []);

  return (
    <div className='dashboard'>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
