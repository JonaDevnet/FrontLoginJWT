import { Login } from './components/Login/Login';
import './App.css'
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Registrarse } from './components/Registrarse/Registrarse';
import { Dashboard } from './components/Dashboard/Dahsboard';
// import {Utilities as u }  from './services/utilities';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para el inicio */}
        <Route path='/' element={<Login/>} />
        {/* Ruta para el componente registro */}
        <Route path='/registrarse' element={<Registrarse/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
