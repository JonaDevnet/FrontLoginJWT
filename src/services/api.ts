import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:5082/api/'
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // La cabecera Authorization incluye el token JWT para proteger las rutas privadas.
    }
    return config;
});