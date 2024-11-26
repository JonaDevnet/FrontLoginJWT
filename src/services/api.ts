const URL: string = 'http://localhost:5082/api/';


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
        Clave: usuario.Clave
    };
    try {
        const response = await fetch(URL + 'Auth/Registrarse', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
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

/// Obtener vehículos con autenticación
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getVehiculos(): Promise<any> {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('No hay un token de acceso válido. Por favor, inicia sesión.');
    }

    try {
        const response = await fetch(`${URL}Vehiculos/Lista`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Si el token está expirado o la solicitud falla
            if (response.status === 401) {
                console.warn('Token expirado. Intentando renovar...');
                await refreshAccessToken();

                // Intentar la solicitud nuevamente con el nuevo token
                const newAccessToken = sessionStorage.getItem('accessToken');
                if (!newAccessToken) throw new Error('No se pudo renovar el token.');

                const retryResponse = await fetch(`${URL}Vehiculos/Lista`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!retryResponse.ok) throw new Error('Error al reintentar la solicitud.');

                return await retryResponse.json();
            } else {
                throw new Error('Error al obtener los vehículos.');
            }
        }

        return await response.json();
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