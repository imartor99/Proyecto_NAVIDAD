export class Carrito {
  constructor(usuarioID = "invitado") {
    this.usuarioID = usuarioID;
    this.articulos = this.cargarCarrito();
    this.actualizarContador(); // Contador del carrito en navbar
  }

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

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem(`carrito_${this.usuarioID}`);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  guardarCarrito() {
    localStorage.setItem(
      `carrito_${this.usuarioID}`,
      JSON.stringify(this.articulos)
    );
  }

  // Métodos para la gestión completa (eliminar, restar, total, contador)

  eliminar(id) {
    this.articulos = this.articulos.filter((item) => item.id !== id);
    this.guardarCarrito();
    this.actualizarContador();
  }

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

  vaciar() {
    this.articulos = [];
    this.guardarCarrito();
    this.actualizarContador();
  }

  calcularTotal() {
    return this.articulos
      .reduce((total, item) => total + item.price * item.cantidad, 0) //0 es el valor inicial de total
      .toFixed(2);
  }

  actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      const totalItems = this.articulos.reduce((total, item) => total + item.cantidad, 0);
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
