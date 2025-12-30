import { consultarAPI } from './api.js';
// URL del endpoint de usuarios en nuestro json-server
const USERS_URL = 'http://localhost:3000/users';
/**
 * Trae todos los usuarios y busca cual coincide en el array.
 */
export async function validarCredenciales(emailInput, passwordInput) {
    try {
        // Consulto usuarios
        const usuarios = await consultarAPI(USERS_URL);
        // Busco usuario
        const usuarioEncontrado = usuarios.find(
            (u) => u.email === emailInput && u.password === passwordInput
        );
        // Si no existe, devolvemos null
        if (!usuarioEncontrado) {
            return null;
        }
        // Si existe, devolvemos un objeto (sin el password por seguridad)
        return {
            id: usuarioEncontrado.id,
            name: usuarioEncontrado.name,
            email: usuarioEncontrado.email
        };
    } catch (error) {
        console.error("Error validando usuario:", error);
        return null;
    }
}