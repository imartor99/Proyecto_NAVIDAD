import { validarCredenciales } from "./auth.js";

const main = () => {
  const formulario = document.getElementById("formularioLogin");
  const mensajeError = document.getElementById("mensajeError");
  const btnRegistrarse = document.getElementById("btnRegistrarse");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Limpiar mensaje anterior
    mensajeError.innerHTML = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuario = await validarCredenciales(email, password);

    if (usuario) {
      // LOGIN EXITOSO
      console.log("Login correcto:", usuario);
      // Guardamos usuario en LocalStorage
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
      // Redirigimos a la tienda
      window.location.href = "home.html";
    } else {
      // LOGIN FALLIDO
      mensajeError.textContent = "Usuario o contraseña incorrectos.";
    }
  });

  if (btnRegistrarse) {
    btnRegistrarse.addEventListener("click", () => {
      alert("Próximamente: Modal de registro");
    });
  }
};

document.addEventListener("DOMContentLoaded", main);
