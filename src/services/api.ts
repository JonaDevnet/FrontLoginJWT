const URL: string = 'http://localhost:5082/api/';

/// Utilidad para manejar solicitudes con token
async function fetchWithTokenRetry(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No hay un token de acceso válido. Por favor, inicia sesión.');
    }

    const authInit = {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    };

    let response = await fetch(input, authInit);

    if (response.status === 401) { // Token expirado
        console.warn('Token expirado. Intentando renovar...');
        await refreshAccessToken();

        const newAccessToken = sessionStorage.getItem('accessToken');
        if (!newAccessToken) {
            throw new Error('No se pudo renovar el token.');
        }

        response = await fetch(input, {
            ...authInit,
            headers: {
                ...authInit.headers,
                Authorization: `Bearer ${newAccessToken}`,
            },
        });
    }

    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    return response;
}

/// Registrar un nuevo usuario
interface UsuarioRequest {
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Celular: number;
    Clave: string;
}

export async function registrarse(usuario: UsuarioRequest) {
    const data = {
        Nombre: usuario.Nombres,
        Apellido: usuario.Apellidos,
        Correo: usuario.Correo,
        NumeroCelular: usuario.Celular,
        Clave: usuario.Clave,
    };

    try {
        const response = await fetch(URL + 'Auth/Registrarse', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error en la creación');

        return response.json();
    } catch (error) {
        console.error('Error en la creación:', error);
        throw new Error('No se pudo crear el usuario.');
    }
}

/// Loguearse
export async function login(correo: string, password: string): Promise<{ accessToken: string }> {
    const data = { Correo: correo, Clave: password };

    try {
        const response = await fetch(`${URL}Auth/Login`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al autenticar.');
        }

        const { isSucces, accessToken } = await response.json();
        if (!isSucces || !accessToken) {
            throw new Error('Error en los tokens retornados por el servidor.');
        }

        return { accessToken };
    } catch (error) {
        console.error('Error en la autenticación:', error);
        throw error;
    }
}

/// Crear un nuevo vehículo
interface VehiculosRequest {
    Tipo: string;
    Patente: string;
    Marca: string;
    Modelo: string;
    Anio: number;
}

export async function nuevovehiculo(vehiculo: VehiculosRequest) {
    const data = {
        Tipo: vehiculo.Tipo,
        Patente: vehiculo.Patente,
        Marca: vehiculo.Marca,
        Modelo: vehiculo.Modelo,
        Anio: vehiculo.Anio,
    };

    try {
        const response = await fetchWithTokenRetry(URL + 'Vehiculos/NuevoVehiculo', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    } catch (error) {
        console.error('Error en la creación:', error);
        throw new Error('No se pudo crear el vehículo.');
    }
}

/// Obtener lista de vehículos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getVehiculos(): Promise<any> {
    try {
        const response = await fetchWithTokenRetry(`${URL}Vehiculos/Lista`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        throw error;
    }
}

/// Renovar token de acceso
export async function refreshAccessToken(): Promise<void> {
    try {
        const response = await fetch(`${URL}Auth/refresh-token`, {
            method: 'POST',
            credentials: 'include', // Enviar la cookie automáticamente
        });

        if (!response.ok) {
            throw new Error('No se pudo renovar el token.');
        }

        const { accessToken } = await response.json();
        sessionStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error al renovar el token:', error);
        throw error;
    }
}

/// Configurar la renovación automática de tokens
function getTokenExpiration(accessToken: string): number | null {
    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload.exp ? payload.exp * 1000 : null; // Convertir a milisegundos
    } catch {
        return null;
    }
}

export function setupTokenAutoRefresh(): void {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) return;

    const expirationTime = getTokenExpiration(accessToken);
    if (!expirationTime) return;

    const now = Date.now();
    const refreshTime = expirationTime - now - 60 * 1000; // Renovar 1 minuto antes de expirar

    if (refreshTime > 0) {
        setTimeout(async () => {
            try {
                await refreshAccessToken();
                setupTokenAutoRefresh(); // Reconfigurar para el nuevo token
            } catch (error) {
                console.error('Error al renovar el token automáticamente:', error);
            }
        }, refreshTime);
    }
}

// Eliminar Vehiculo

export async function EliminarVehiculo(id: number) {
    try {
        const response = await fetchWithTokenRetry(`${URL}Vehiculos/EliminarVehiculo?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        throw error;
    }
}

interface VehiculosRequesteEdit {
    IdVehiculo: number,
    Tipo: string;
    Patente: string;
    Marca: string;
    Modelo: string;
    Anio: number;
}
export async function EditarVehiculo(vehiculo: VehiculosRequesteEdit) {
    console.log('vehiculo en api', vehiculo)
    const data = {
        IdVehiculo: vehiculo.IdVehiculo,
        Tipo: vehiculo.Tipo,
        Patente: vehiculo.Patente,
        Marca: vehiculo.Marca,
        Modelo: vehiculo.Modelo,
        Anio: vehiculo.Anio,
    };
    console.log('llamado a api: data =', data)
    try {
        const response = await fetchWithTokenRetry(`${URL}Vehiculos/EditarVehiculo` , {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('respuesta del llamado', response)
        return response.json();
    } catch (error) {
        console.error('Error al editar el vehículo:', error);
        throw error;
    }
}

