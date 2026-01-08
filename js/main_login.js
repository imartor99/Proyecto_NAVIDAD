/**
 * main_login.js
 *
 * Controlador principal para la página de Login y Registro (`login.html`).
 * Gestiona:
 * - La alternancia entre formularios (efecto Flip Card).
 * - La validación del CAPTCHA matemático.
 * - El inicio de sesión y registro de nuevos usuarios interactuando con `auth.js`.
 */
import { validarCredenciales, mostrarCaptcha } from "./auth.js";

const main = () => {
  // Variable para almacenar el resultado correcto del CAPTCHA
  let resultadoCaptcha;

  // Generar CAPTCHA al cargar
  resultadoCaptcha = mostrarCaptcha();

  const formulario = document.getElementById("formularioLogin");
  const btnRegistrarse = document.getElementById("btnRegistrarse");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Validar CAPTCHA
    const respuestaCaptcha = parseInt(document.getElementById("captcha").value);
    if (respuestaCaptcha !== resultadoCaptcha) {
      Toastify({
        text: "CAPTCHA incorrecto. Inténtalo de nuevo.",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #e74c3c, #c0392b)",
        },
      }).showToast();
      resultadoCaptcha = mostrarCaptcha();
      document.getElementById("captcha").value = "";
      return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuario = await validarCredenciales(email, password);

    if (usuario) {
      // LOGIN EXITOSO
      Toastify({
        text: "Login correcto. Redirigiendo...",
        duration: 2000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #27ae60, #229954)",
        },
      }).showToast();

      console.log("Login correcto:", usuario);
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

      // Pequeño delay para que se vea el toast
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      // LOGIN FALLIDO
      Toastify({
        text: "Usuario o contraseña incorrectos.",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #e74c3c, #c0392b)",
        },
      }).showToast();
    }
  });

  // ========== LÓGICA DEL FLIP CARD ==========
  const tarjetaFlip = document.getElementById("tarjetaFlip");
  const btnMostrarRegistro = document.getElementById("btnMostrarRegistro");
  const btnMostrarLogin = document.getElementById("btnMostrarLogin");

  // Al hacer clic en "Registrarse", volteo la tarjeta añadiendo la clase 'volteada'
  btnMostrarRegistro.addEventListener("click", () => {
    tarjetaFlip.classList.add("volteada");
  });

  // Al hacer clic en "Volver al Login", quito la clase 'volteada' para volver a la cara frontal
  btnMostrarLogin.addEventListener("click", () => {
    tarjetaFlip.classList.remove("volteada");
  });

  // ========== LÓGICA DEL FORMULARIO DE REGISTRO ==========
  const formularioRegistro = document.getElementById("formularioRegistro");

  formularioRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombreRegistro").value;
    const email = document.getElementById("emailRegistro").value;
    const password = document.getElementById("passwordRegistro").value;

    // Validación básica de contraseña
    if (password.length < 6) {
      Toastify({
        text: "La contraseña debe tener al menos 6 caracteres.",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #e74c3c, #c0392b)",
        },
      }).showToast();
      return;
    }

    // Creo el objeto del nuevo usuario
    const nuevoUsuario = {
      name: nombre,
      email: email,
      password: password,
    };

    try {
      // Hago un POST a json-server para añadir el usuario a db.json
      const respuesta = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (respuesta.ok) {
        Toastify({
          text: "Cuenta creada exitosamente. Ahora puedes iniciar sesión.",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(135deg, #27ae60, #229954)",
          },
        }).showToast();

        // Limpio el formulario y vuelvo al login
        formularioRegistro.reset();
        setTimeout(() => {
          tarjetaFlip.classList.remove("volteada");
        }, 1500);
      } else {
        throw new Error("Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      Toastify({
        text: "Error al crear la cuenta. Inténtalo de nuevo.",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #e74c3c, #c0392b)",
        },
      }).showToast();
    }
  });
};

document.addEventListener("DOMContentLoaded", main);
