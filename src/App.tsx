import { Login } from './components/Login/Login';
import './App.css'
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Registrarse } from './components/Registrarse/Registrarse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para el inicio */}
        <Route path='/' element={<Login/>} />
        {/* Ruta para el componente registro */}
        <Route path='/registrarse' element={<Registrarse/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
