import { consultarAPI } from "./api.js";
import { crearCards } from "./dom.js";

const main = async () => {
  try {
    // Defino las categorías tecnológicas que queremos mostrar, previamentte consultadas en la doc de la API.
    const categorias = [
      "smartphones",
      "laptops",
      "tablets",
      "mobile-accessories",
      "mens-watches",
      "womens-watches",
    ];

    // Creo un array de promesas para pedir todas las categorías en paralelo
    const promesas = categorias.map((categoria) =>
      consultarAPI(`https://dummyjson.com/products/category/${categoria}`)
    );

    // Espero a que todas las peticiones terminen
    const resultados = await Promise.all(promesas);

    // Combino los arrays de productos de cada respuesta en uno solo usando flatMap
    // Cada respuesta de categoría tiene la forma { products: [...], total: ..., skip: ..., limit: ... }
    const productosTecnologia = resultados.flatMap(
      (resultado) => resultado.products
    );

    // Renderizo los productos combinados
    crearCards(productosTecnologia);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
};

document.addEventListener("DOMContentLoaded", main);
