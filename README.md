# Proyecto Tienda Online (ProtoShop) - Documentación Técnica

¡Bienvenido! Este archivo documenta el **proceso de desarrollo**, las **decisiones técnicas** que tomé y los **retos** a los que me enfrenté construyendo esta tienda online.

---

## Visión y Arquitectura

Para este proyecto, mi objetivo principal era crear una experiencia de usuario fluida y una interfaz moderna, manteniendo el código organizado y escalable. El proyecto principalmente esta creado con **HTML**, **CSS** y **JavaScript**.

### Estructura: MPA vs SPA

Valoré hacer una _Single Page Application_ (SPA), pero decidí optar por una **Multi-Page Application (MPA)** (`index.html`, `login.html`, `nosotros.html`).

- **¿Por qué?** Permite una separación lógica más clara de responsabilidades para un proyecto de este tipo y facilita la separación natural de cada sección.
- Sin embargo, mantuve la **persistencia de estado** (como el carrito y el usuario logueado) usando `localStorage`, logrando que se sienta casi tan fluido como una SPA. Para hacer una compra, el usuario debe estar logueado.
- El contenido se carga dinámicamente asi como los filtros, con el uso de JavaScript.

### Organización de Código

Para evitar el "Spaghetti Code", modularicé la lógica:

- `api.js`: Centraliza las peticiones (Fetch) para no repetir código.
- `auth.js`: Gestiona la sesión y validaciones de usuario.
- `Carrito.js`: Una **Clase/Objeto** dedicada enteramente a la lógica de negocio del carrito (añadir, restar, calcular total).
- `dom.js`: Se encarga de "pintar" en pantalla. Decidí separar la lógica de datos de la manipulación del DOM.
- `main_login.js`: Se encarga de la lógica de la página de login.
- `main_index.js`: Se encarga de la lógica de la página de index.

---

## Diseño y UX

Implementé una estética de fondos translúcidos con desenfoque.

- **CSS Puro**: No usé Bootstrap ni Tailwind. Todo el CSS está escrito a mano usando metodología **BEM** (Block Element Modifier) para evitar conflictos de nombres (`.tarjeta-producto__titulo`).
- **Separación de Estilos**: Conforme el proyecto creció, el archivo `style.css` se volvió enorme. Decidí extraer los estilos específicos de la página "Nosotros" a `style_nosotros.css`, y para el login en `style_login.css`, buscando mejorar el mantenimiento del código.

---

## Retos Técnicos y Soluciones

Durante el desarrollo, me encontré con varios problemas interesantes:

### 1. Implementación del Scroll Infinito

Implementé un scroll infinito para los productos, para que el usuario pueda ver todos los productos disponibles sin tener que recargar la página, solamente haciendo scroll van apareciendo más productos de 9 en 9.

Para ello he usado un **sentinel** (un elemento `div` que se encuentra al final de la lista de productos) y un event listener para detectar cuando el usuario llega al final de la lista de productos y visualiza el primer pixel de ese div, para cargar más productos.

Me he decantado por esta opción ya que me parece que es la más eficiente y que ofrece una experiencia de usuario fluida, a diferencia del scroll infinito haciendo calculos con el evento scroll y el tamaño de la pantalla.

### 2. Simulación de Backend (JSON-Server & Auth)

Necesitaba usuarios reales.

- Implementé un sistema de Registro/Login simulado contra `db.json`.
- Para darle realismo, añadí la opcion de POST para el registro de nuevos usuarios.

### 3. EmailJS

He tenido que documentarme del uso de esta librería, para asi poder enviar correos electrónicos con el resumen de la compra al finalizar el pedido.

---

## Estrategia Responsiva

- **Enfoque**: Escritorio primero, adaptando hacia abajo.
- **Tablet (576px - 768px)**:
  - Transformé la navegación horizontal en un layout vertical.
- **Mobile (< 576px)**:
  - Cambié el Grid de productos de múltiples columnas a 1 sola para maximizar la legibilidad.
  - Rediseñé los items del carrito para que los controles táctiles fueran más accesibles.

---

## URL del proyecto


---

## Cómo ejecutar el proyecto

1.  **Instalar dependencias JSON-Server** (para el servidor simulado):

    ```bash
    npm install -g json-server
    ```

2.  **Iniciar el servidor de base de datos**:

    ```bash
    json-server --watch db.json
    ```

3.  **Abrir la web**:
    Lanza `index.html` en tu navegador o usa Live Server.

---

_Desarrollado por Ignacio Martínez Torres._
