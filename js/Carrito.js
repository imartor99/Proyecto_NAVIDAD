/**
 * Clase que gestiona la lógica del carrito de compras.
 * Maneja el almacenamiento local (localStorage) y la generación del HTML del carrito.
 */
export class Carrito {
  /**
   * Inicializa el carrito para un usuario específico.
   * Si hay datos guardados en localStorage, los carga.
   * @param {string|number} usuarioID - Identificador del usuario (default: "invitado")
   */
  constructor(usuarioID = "invitado") {
    this.usuarioID = usuarioID;
    this.articulos = this.cargarCarrito();
    this.actualizarContador(); // Contador del carrito en navbar
  }

  /**
   * Añade un producto al carrito o incrementa su cantidad si ya existe.
   * @param {Object} elemento - Objeto producto con id, title, price, imagen, etc.
   */
  add(elemento) {
    // Busco si ya existe el articulo para sumar cantidad
    const articuloExistente = this.articulos.find(
      (item) => item.id === elemento.id
    );

    if (articuloExistente) {
      articuloExistente.cantidad++;
    } else {
      this.articulos.push({ ...elemento, cantidad: 1 }); //añadimos propiedad cantidad al objeto producto
    }

    this.guardarCarrito();
    this.actualizarContador();
  }

  /**
   * Genera el HTML de los items del carrito para mostrar en el modal.
   * @returns {DocumentFragment} Fragmento de documento con los elementos del carrito
   */
  dibujarCarrito() {
    const fragment = document.createDocumentFragment();

    if (this.articulos.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.textContent = "El carrito está vacío!";
      mensaje.classList.add("carrito-vacio");
      fragment.appendChild(mensaje);
    } else {
      this.articulos.forEach((articulo) => {
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML = `
          <img src="${articulo.thumbnail}" alt="${articulo.title}" class="carrito-item__img">
          <div class="carrito-item__info">
              <h4>${articulo.title}</h4>
              <p>$${articulo.price}</p>
          </div>
          <div class="carrito-item__controles">
              <button class="btn-restar" data-id="${articulo.id}">-</button>
              <span>${articulo.cantidad}</span>
              <button class="btn-sumar" data-id="${articulo.id}">+</button>
          </div>
          <button class="btn-eliminar" data-id="${articulo.id}">
              <span class="material-icons">delete</span>
          </button>
        `;

        fragment.appendChild(div);
      });

      // Botón de Vaciar al final de la lista
      const divVaciar = document.createElement("div");
      divVaciar.classList.add("carrito-acciones");
      divVaciar.innerHTML = `
        <button class="btn-vaciar">
          Vaciar Carrito <span class="material-icons">remove_shopping_cart</span>
        </button>
      `;
      fragment.appendChild(divVaciar);
    }

    return fragment;
  }

  /**
   * Recupera el estado del carrito desde localStorage.
   * @returns {Array} Array de productos o array vacío si no hay datos.
   */
  cargarCarrito() {
    const carritoGuardado = localStorage.getItem(`carrito_${this.usuarioID}`);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  /**
   * Guarda el estado actual del carrito en localStorage.
   */
  guardarCarrito() {
    localStorage.setItem(
      `carrito_${this.usuarioID}`,
      JSON.stringify(this.articulos)
    );
  }

  // Métodos para la gestión completa (eliminar, restar, total, contador)

  /**
   * Elimina un producto completamente del carrito por su ID.
   * @param {number} id - ID del producto a eliminar
   */
  eliminar(id) {
    this.articulos = this.articulos.filter((item) => item.id !== id);
    this.guardarCarrito();
    this.actualizarContador();
  }

  /**
   * Decrementa la cantidad de un producto. Si llega a 0, lo elimina.
   * @param {number} id - ID del producto
   */
  restar(id) {
    const articulo = this.articulos.find((item) => item.id === id);
    if (articulo) {
      articulo.cantidad--;
      if (articulo.cantidad <= 0) {
        this.eliminar(id);
      } else {
        this.guardarCarrito();
        this.actualizarContador();
      }
    }
  }

  /**
   * Elimina todos los productos del carrito.
   */
  vaciar() {
    this.articulos = [];
    this.guardarCarrito();
    this.actualizarContador();
  }

  /**
   * Calcula el precio total de todos los productos en el carrito.
   * @returns {string} El total formateado con 2 decimales.
   */
  calcularTotal() {
    return this.articulos
      .reduce((total, item) => total + item.price * item.cantidad, 0) //0 es el valor inicial de total
      .toFixed(2);
  }

  /**
   * Actualiza el badge/contador visual del carrito en la barra de navegación.
   * Se invoca cada vez que hay un cambio en el carrito.
   */
  actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      const totalItems = this.articulos.reduce(
        (total, item) => total + item.cantidad,
        0
      );
      contador.textContent = totalItems;
      contador.classList.remove("d-none", "d-block");
      if (totalItems > 0) {
        contador.classList.add("d-block");
      } else {
        contador.classList.add("d-none");
      }
    }
  }
}
