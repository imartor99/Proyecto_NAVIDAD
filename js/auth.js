import { consultarAPI } from "./api.js";
// URL del endpoint de usuarios en nuestro json-server
const USERS_URL = "http://localhost:3000/users";
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
      email: usuarioEncontrado.email,
    };
  } catch (error) {
    console.error("Error validando usuario:", error);
    return null;
  }
}

/**
 * Genera un CAPTCHA matemático simple y devuelve la pregunta y resultado.
 */
export function generarCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const resultado = num1 + num2;
  const pregunta = `¿Cuánto es ${num1} + ${num2}?`;

  return { pregunta, resultado };
}

/**
 * Muestra un nuevo CAPTCHA en el elemento especificado y devuelve el resultado.
 * @param {string} elementoId - ID del elemento donde mostrar la pregunta
 * @returns {number} - El resultado correcto del CAPTCHA
 */
export function mostrarCaptcha(elementoId = "preguntaCaptcha") {
  const captcha = generarCaptcha();
  const elemento = document.getElementById(elementoId);
  if (elemento) {
    elemento.textContent = captcha.pregunta;
  }
  return captcha.resultado;
}
