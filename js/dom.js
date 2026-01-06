import { verificarLogin } from "./auth.js";
//============ CREACION DE CARDS ============

/**
 * Crea una card por producto y devuelve el elemento DOM
 * @param {Object} producto - El producto a mostrar
 * @param {Function} onAdd - Callback para añadir al carrito
 * @returns {HTMLElement} - La card creada
 */
export function crearCard(producto, onAdd = null) {
  const card = document.createElement("div");
  card.classList.add("tarjeta-producto");

  // Añadimos evento click para abrir el modal
  card.addEventListener("click", () => abrirModal(producto, onAdd));
  card.style.cursor = "pointer"; // Indicador visual de clic

  card.innerHTML = `
        <div class="tarjeta-producto__imagen-contenedor">
            <img src="${producto.thumbnail}" alt="${producto.title}" class="tarjeta-producto__imagen">
        </div>
        <div class="tarjeta-producto__info">
            <h2 class="tarjeta-producto__titulo">${producto.title}</h2>
            <p class="tarjeta-producto__categoria">${producto.category}</p>
            <div class="tarjeta-producto__rating">
                <span class="material-icons">star</span>
                <span>${producto.rating}</span>
            </div>
            <p class="tarjeta-producto__precio">$${producto.price}</p>
            <button class="tarjeta-producto__boton btn-add-cart">Añadir al Carrito</button>
        </div>
    `;

  // Listener para el botón de Añadir al Carrito (evitando que abra el modal)
  const btnAdd = card.querySelector(".btn-add-cart");
  btnAdd.addEventListener("click", (e) => {
    e.stopPropagation(); // Evitar que se abra el modal

    // Verifico si el usuario está logueado
    // Verifico login usando la función centralizada
    if (!verificarLogin()) return;

    // Si hay callback, lo ejecutamos
    if (onAdd) {
      onAdd(producto);
      mostrarNotificacion("Producto añadido al carrito", "green");
    } else {
      mostrarNotificacion("Error: Carrito no inicializado", "red");
    }
  });

  return card;
}

/**
 * Renderiza un array de productos en el contenedor principal.
 * @param {Array} productos
 * @param {boolean} limpiar Si es true, vacía el contenedor antes de añadir.
 * @param {Function} onAdd Callback para añadir al carrito
 */
export function crearCards(productos, limpiar = false, onAdd = null) {
  const contenedor = document.getElementById("contenedor");
  if (!contenedor) return;

  contenedor.classList.add("cards");

  if (limpiar) {
    contenedor.innerHTML = "";
  }

  productos.forEach((p) => {
    // Pasamos el callback onAdd a cada card individual
    const card = crearCard(p, onAdd);
    contenedor.appendChild(card);
  });
}

//============ MODAL DETALLE PRODUCTO ============

/**
 * Abre el modal con la información detallada del producto
 */
export function abrirModal(producto, onAdd = null) {
  const modal = document.getElementById("modal-producto");
  if (!modal) return;

  // Llenar datos
  document.getElementById("modal-img").src = producto.thumbnail;
  document.getElementById("modal-titulo").textContent = producto.title;
  document.getElementById("modal-categoria").textContent = producto.category;
  document.getElementById("modal-marca").textContent =
    producto.brand || "Genérico";
  // Precio y Descuento
  document.getElementById("modal-precio").textContent = `$${producto.price}`;
  const descuento = document.getElementById("modal-descuento");
  if (producto.discountPercentage) {
    descuento.textContent = `-${producto.discountPercentage}%`;
    descuento.classList.remove("d-none");
    descuento.classList.add("d-inline-block");
  } else {
    descuento.classList.remove("d-inline-block");
    descuento.classList.add("d-none");
  }
  // Descripcion
  document.getElementById("modal-desc").textContent = producto.description;

  // Detalles Extra (Validando si existen propiedades, sino muestro un texto genérico)
  document.getElementById("modal-stock").textContent = producto.stock
    ? `${producto.stock} unidades`
    : "Consultar";

  const elStock = document.getElementById("modal-stock");
  elStock.classList.remove("text-red", "text-green");
  if (producto.stock && producto.stock < 10) {
    elStock.classList.add("text-red");
  } else {
    elStock.classList.add("text-green");
  }

  document.getElementById("modal-sku").textContent =
    producto.sku || `#${producto.id}`; //si no existe sku, muestro el id como referencia del producto

  // Peso y Dimensiones
  document.getElementById("modal-peso").textContent = producto.weight
    ? `${producto.weight} kg`
    : "N/A";

  if (producto.dimensions) {
    const { width, height, depth } = producto.dimensions; //almacenamos cada propiedad de dimensions en una variable
    document.getElementById(
      "modal-dimensiones"
    ).textContent = `${width} x ${height} x ${depth} cm`;
  } else {
    document.getElementById("modal-dimensiones").textContent = "N/A";
  }

  document.getElementById("modal-garantia").textContent =
    producto.warrantyInformation || "Garantía Estándar 2 años";
  document.getElementById("modal-envio").textContent =
    producto.shippingInformation || "Envío en 3-5 días";
  document.getElementById("modal-devolucion").textContent =
    producto.returnPolicy || "30 días de devolución";

  // Rating
  document.getElementById("modal-puntuacion").textContent = producto.rating;
  document.getElementById("modal-votos").textContent = `(${
    Math.floor(Math.random() * 500) + 50
  } votos)`; // Simulado ya que la api solo muestra 3 reviews pero no cuadra con el rating

  // Lógica Botón Añadir al Carrito del Modal
  const btnAñadirModal = modal.querySelector(".modal__boton-accion");
  if (btnAñadirModal) {
    btnAñadirModal.onclick = () => {
      // Verifico si el usuario está logueado
      // Verifico login usando la función centralizada
      if (!verificarLogin()) return;

      if (onAdd) {
        onAdd(producto);
        mostrarNotificacion("Producto añadido al carrito", "green");
        modal.close();
      }
    };
  }

  // Cerrar modal
  const btnCerrar = document.getElementById("btn-cerrar-modal");
  btnCerrar.onclick = () => modal.close();

  // Cerrar al hacer click fuera (en el backdrop)
  modal.onclick = (e) => {
    if (e.target === modal) modal.close();
  };

  // Mostrar modal al hacer click en la tarjeta
  modal.showModal();
}

//============ NOTIFICACIONES CON TOAST ============

/**
 * Muestra un mensaje Toast
 */
export function mostrarNotificacion(texto, color = "#f1c40f") {
  if (typeof Toastify !== "undefined") {
    Toastify({
      text: texto,
      duration: 1000,
      gravity: "bottom",
      position: "center",
      style: {
        background: color,
        borderRadius: "20px",
        color: color === "#f1c40f" ? "black" : "white",
      },
      stopOnFocus: false,
    }).showToast();
  }
}

//============ FILTROS ============

/**
 * Llena un elemento select con opciones.
 * @param {string} idSelect ID del elemento select
 * @param {Array} opciones Array de strings con los valores
 */
export function llenarSelectCategorias(idSelect, opciones) {
  const select = document.getElementById(idSelect);
  if (!select) return;

  // Mantener la opción por defecto
  select.innerHTML = '<option value="">Todas</option>';

  opciones.forEach((op) => {
    const item = document.createElement("option");
    item.value = op;
    item.textContent = op
      .replace(/-/g, " ") //Quito guiones
      .replace(/\b\w/g, (l) => l.toUpperCase()); //Mayuscula inicial
    select.appendChild(item);
  });
}

/**
 * Lógica pura de filtrado por atributo/valor.
 * @param {Array} productos Array de productos
 * @param {Object} obFiltro Objeto con el atributo y valor de filtro
 * @returns {Array} Array de productos filtrados
 */
export function filtrarProductos(productos, obFiltro) {
  const { atributo, valor } = obFiltro;

  if (valor === "" || valor === null || isNaN(valor)) {
    return productos;
  }

  return productos.filter((producto) => {
    if (atributo === "price") {
      return producto.price < valor;
    } else if (atributo === "price-higher") {
      return producto.price >= valor;
    } else if (atributo === "rate") {
      return producto.rating < valor;
    } else if (atributo === "rate-higher") {
      return producto.rating >= valor;
    }

    return true; // Si no se cumple ninguna condición, se mantiene el producto igualmente para evitar undefined
  });
}

//============ SCROLL INFINITO ============

/**
 * Configura el IntersectionObserver para el scroll infinito.
 * @param {string} idElemento ID del centinela
 * @param {Function} callback Función a ejecutar cuando se intersecta
 * @returns {IntersectionObserver} La instancia del observer
 */
export function configurarObserver(idElemento, callback) {
  const sentinel = document.getElementById(idElemento);
  if (!sentinel) return null;

  const opciones = {
    root: null, //Vigila la pantalla del navegador
    rootMargin: "0px 0px -40px 0px", // Margen de 40px desde el final de la pantalla para controlar cuando se dispara el evento
    threshold: 1.0, // solo cuando el centinela entre en la pantalla al 100%
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, opciones);

  observer.observe(sentinel);
  return observer;
}
