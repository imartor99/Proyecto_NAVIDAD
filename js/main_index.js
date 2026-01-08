/**
 * main_index.js
 *
 * Controlador principal para la página de inicio (`index.html`).
 * Gestiona:
 * - La alternancia entre formularios (efecto Flip Card).
 * - La gestión del carrito de compras.
 * - La carga dinámica de productos desde una API.
 * - La paginación y filtrado de productos.
 * - El manejo de sesiones y autenticación.
 */

import { consultarAPI } from "./api.js";
import { cerrarSesion, obtenerUsuario } from "./auth.js";
import {
  crearCards,
  llenarSelectCategorias,
  filtrarProductos,
  configurarObserver,
  mostrarNotificacion,
  ConfigurarModalCarrito,
} from "./dom.js";
import { Carrito } from "./Carrito.js";

// VARIABLES DE ESTADO
let todosLosProductos = [];
let productosFiltrados = [];
let paginaActual = 0;
const ITEMS_POR_PAGINA = 9;
let observer = null; //variable global para el observer del scroll infinito

// GESTIÓN DE SESIÓN PARA CARRITO Y BOTON LOGIN/LOGOUT (Global)
const usuarioMain = obtenerUsuario();
// Inicializo Carrito inmediatamente para que esté disponible en todas las funciones
let carrito = new Carrito(usuarioMain ? usuarioMain.id : "invitado");

// FUNCIONES AUXILIARES DE MAIN

/**
 * Configura los listeners para los filtros
 */
const configurarListeners = () => {
  // Filtro Categoría (Select)
  const filtroCategoria = document.getElementById("filtro-categoria");
  filtroCategoria.addEventListener("change", aplicarFiltrosYOrden);

  // Filtro Valor (Input numérico) - Usamos 'input' para actualización al momento
  const filtroValor = document.getElementById("filtro-valor");
  filtroValor.addEventListener("input", aplicarFiltrosYOrden);

  // Filtro Atributo (Select: Precio/Rate)
  const filtroAtributo = document.getElementById("filtro-atributo");
  filtroAtributo.addEventListener("change", aplicarFiltrosYOrden);

  // Filtro Orden (Select: Asc/Desc)
  const filtroOrden = document.getElementById("filtro-orden");
  filtroOrden.addEventListener("change", aplicarFiltrosYOrden);

  // Botón Limpiar
  const btnLimpiar = document.getElementById("btn-limpiar-filtros");
  btnLimpiar.addEventListener("click", () => {
    // Reseteamos valores a mano
    filtroCategoria.value = "";
    filtroValor.value = "";
    filtroAtributo.value = "price";
    filtroOrden.value = "defecto";

    // Volvemos a ejecutar la lógica
    aplicarFiltrosYOrden();
  });
};

/**
 * Carga mas productos tras disparar el evento de observer de scroll infinito
 */
const cargarMasProductos = () => {
  const inicio = paginaActual * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;

  //Obtengo el lote de productos de 9
  const loteProductos = productosFiltrados.slice(inicio, fin);

  if (loteProductos.length > 0) {
    // Renderizamos sin limpiar (append) y pasamos el callback de añadir (onAdd)
    crearCards(loteProductos, false, (p) => {
      if (carrito) {
        carrito.add(p);
      } else {
        console.error("Error: Carrito no inicializado aún");
        mostrarNotificacion("Error interno del carrito", "red");
      }
    });
    paginaActual++;
  }
};

/**
 * Inicializa el listado de productos
 */
const iniciarListado = () => {
  paginaActual = 0; //Reset de la página actual

  // Limpiamos contenedor (param true) y mostramos primera página
  crearCards([], true);
  cargarMasProductos();

  // Reiniciar Observer
  if (observer) observer.disconnect();
  // Pasamos el callback que maneja la lógica de validación y carga
  observer = configurarObserver("sentinel", () => {
    const totalMostrados = paginaActual * ITEMS_POR_PAGINA;
    if (totalMostrados < productosFiltrados.length) {
      mostrarNotificacion("Cargando más productos...", "rgba(0,0,0,0.7)");
      setTimeout(cargarMasProductos, 500);
    }
  });
};

/**
 * Aplica los filtros y ordenamiento
 */
const aplicarFiltrosYOrden = () => {
  // Recoger valores del DOM
  const categoriaSel = document.getElementById("filtro-categoria").value;
  const atributo = document.getElementById("filtro-atributo").value;
  const valor = parseFloat(document.getElementById("filtro-valor").value);
  const orden = document.getElementById("filtro-orden").value;

  // Filtrar
  let resultado = [...todosLosProductos];

  if (categoriaSel !== "") {
    resultado = resultado.filter((p) => p.category === categoriaSel);
  }

  if (!isNaN(valor)) {
    resultado = filtrarProductos(resultado, { atributo, valor });
  }

  // Ordenar
  if (orden !== "defecto") {
    resultado.sort((a, b) => {
      if (orden === "precio-asc") return a.price - b.price;
      if (orden === "precio-desc") return b.price - a.price;
      if (orden === "nombre-asc") return a.title.localeCompare(b.title); //localeCompare compara cadenas de texto
      if (orden === "nombre-desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }

  // Actualizar Estado
  productosFiltrados = resultado;

  // Reiniciar Vista
  iniciarListado();

  if (productosFiltrados.length === 0) {
    mostrarNotificacion("No se encontraron productos", "#f1c40f");
  }
};

const main = async () => {
  try {
    // Comprobamos usuario sin forzar login para cambios en NAVBAR
    const usuario = obtenerUsuario();

    // Configurar botón Login/Logout
    const btnLogin = document.getElementById("btn-login-logout");
    if (btnLogin) {
      if (usuario) {
        // LOGUEADO: Mostrar Logout
        btnLogin.innerHTML =
          '<span class="material-icons">logout</span> Logout';
        btnLogin.href = "#";
        btnLogin.addEventListener("click", (e) => {
          e.preventDefault();
          cerrarSesion();
        });
        mostrarNotificacion(`Hola, ${usuario.name}`, "#6c5ce7");
      } else {
        // NO LOGUEADO: Mostrar Login
        btnLogin.innerHTML = '<span class="material-icons">login</span> Login';
        btnLogin.href = "login.html";
      }
    }

    // Configuración MODAL CARRITO 
    ConfigurarModalCarrito(carrito);

    // CARGA DE DATOS (categorias previamente seleccionadas tras consultar la doc de la API)
    const categorias = [
      "smartphones",
      "laptops",
      "tablets",
      "mobile-accessories",
      "mens-watches",
      "womens-watches",
    ];

    // Creo un array de promesas para cada categoría
    const promesas = categorias.map((cat) =>
      consultarAPI(`https://dummyjson.com/products/category/${cat}`)
    );
    const resultados = await Promise.all(promesas); //Con Promise.all se ejecutan todas las promesas para cada categoría al mismo tiempo
    // resultados me devuelve un array de arrays de productos por categoría

    //flatMap me devuelve un único array de productos de todas las categorías. map se queda con la propiedad products de cada categoría y flat une todos los arrays en uno solo
    todosLosProductos = resultados.flatMap((res) => res.products);
    productosFiltrados = [...todosLosProductos]; //hago una copia de todos los productos para aplicar los filtros y luego poder volver a mostrar todos los productos

    // INICIALIZO FILTROS
    llenarSelectCategorias("filtro-categoria", categorias);

    // EVENT LISTENERS
    configurarListeners();

    // RENDERIZADO INICIAL DE LOS PRODUCTOS
    iniciarListado();
  } catch (error) {
    console.error("Error crítico:", error);
    mostrarNotificacion("Error al cargar productos", "red");
  }
};

document.addEventListener("DOMContentLoaded", main);
