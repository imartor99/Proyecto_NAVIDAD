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

  if (btnRegistrarse) {
    btnRegistrarse.addEventListener("click", () => {
      alert("Próximamente: Modal de registro");
    });
  }
};

document.addEventListener("DOMContentLoaded", main);
