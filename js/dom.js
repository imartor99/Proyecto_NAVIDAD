export function crearCard(producto) {
  const card = document.createElement("div");
  card.classList.add("tarjeta-producto");

  card.innerHTML = `
        <div class="tarjeta-producto__imagen-contenedor">
            <img src="${producto.thumbnail}" alt="${producto.title}" class="tarjeta-producto__imagen">
        </div>
        <div class="tarjeta-producto__info">
            <h2 class="tarjeta-producto__titulo">${producto.title}</h2>
            <p class="tarjeta-producto__categoria">${producto.category}</p>
            <p class="tarjeta-producto__precio">$${producto.price}</p>
            <button class="tarjeta-producto__boton">Añadir al Carrito</button>
        </div>
    `;

  return card;
}

export function crearCards(arrPersonajes) {
  const contenedor = document.getElementById("contenedor");
  contenedor.classList.add("cards");

  contenedor.innerHTML = "";
  arrPersonajes.forEach((personaje) => {
    const card = crearCard(personaje);

    contenedor.appendChild(card);
  });
}
