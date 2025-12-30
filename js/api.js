/**
 * Realiza una petición GET a la URL indicada y devuelve el JSON.
 * @param {string} url - La dirección a consultar.
 */
export async function consultarAPI(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error en la consulta API:", error);
        throw error; // Re-lanzo el error para que lo maneje quien llamó (el main_login en mi caso)
    }
}