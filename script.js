// ===== Menú móvil =====
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

btnMenu.addEventListener("click", () => {
  menu.classList.toggle("abierto");
});

menu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => menu.classList.remove("abierto"));
});

// ===== Mostrar / ocultar información de tarifas =====
const btnInfo = document.getElementById("btn-info");
const infoExtra = document.getElementById("info-extra");

btnInfo.addEventListener("click", () => {
  const oculto = infoExtra.classList.toggle("oculto");
  btnInfo.textContent = oculto ? "Ver más información" : "Ocultar información";
});

// ===== Buscador y filtros de espacios =====
const buscador = document.getElementById("buscador");
const botonesFiltro = document.querySelectorAll(".filtro");
const espacios = document.querySelectorAll("#lista-espacios .espacio");
const contador = document.getElementById("contador");

let filtroActual = "todos";

function aplicarFiltros() {
  const texto = buscador.value.trim().toLowerCase();
  let visibles = 0;

  espacios.forEach((espacio) => {
    const coincideTexto = espacio.textContent.toLowerCase().includes(texto);
    const coincideEstado =
      filtroActual === "todos" || espacio.dataset.estado === filtroActual;

    if (coincideTexto && coincideEstado) {
      espacio.classList.remove("oculto");
      visibles++;
    } else {
      espacio.classList.add("oculto");
    }
  });

  const libres = document.querySelectorAll(
    '#lista-espacios .espacio[data-estado="libre"]'
  ).length;
  contador.textContent =
    "Mostrando " + visibles + " espacio(s) — Libres en total: " + libres;
}

buscador.addEventListener("input", aplicarFiltros);

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");
    filtroActual = boton.dataset.filtro;
    aplicarFiltros();
  });
});

aplicarFiltros();

// ===== Validación del formulario de reserva =====
const formulario = document.getElementById("form-reserva");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre");
  const placa = document.getElementById("placa");
  const tipo = document.getElementById("tipo");
  const fecha = document.getElementById("fecha");
  const horas = document.getElementById("horas");

  [nombre, placa, tipo, fecha, horas].forEach((c) => c.classList.remove("error"));

  // Fecha mínima: hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaElegida = new Date(fecha.value + "T00:00:00");

  // Placa boliviana: 3 a 4 números + 3 letras (ej: 1234ABC)
  const patronPlaca = /^[0-9]{3,4}[A-Za-z]{3}$/;

  if (nombre.value.trim().length < 3) {
    nombre.classList.add("error");
    return mostrarMensaje("Escribe tu nombre completo (mínimo 3 letras).", "fallo");
  }

  if (!patronPlaca.test(placa.value.trim())) {
    placa.classList.add("error");
    return mostrarMensaje("La placa no es válida. Ejemplo: 1234ABC.", "fallo");
  }

  if (tipo.value === "") {
    tipo.classList.add("error");
    return mostrarMensaje("Selecciona el tipo de vehículo.", "fallo");
  }

  if (!fecha.value || fechaElegida < hoy) {
    fecha.classList.add("error");
    return mostrarMensaje("Elige una fecha de hoy en adelante.", "fallo");
  }

  const cantidadHoras = Number(horas.value);
  if (!Number.isInteger(cantidadHoras) || cantidadHoras < 1 || cantidadHoras > 24) {
    horas.classList.add("error");
    return mostrarMensaje("Las horas deben estar entre 1 y 24.", "fallo");
  }

  // Cálculo del costo: tarifa por hora, con tope de día completo
  const tarifaHora = Number(tipo.value);
  const tarifaDia = { 3: 20, 5: 35, 8: 50 }[tarifaHora];
  const total = Math.min(tarifaHora * cantidadHoras, tarifaDia);

  mostrarMensaje(
    "¡Reserva confirmada para " + nombre.value.trim() + "! Placa " +
      placa.value.trim().toUpperCase() + " — " + cantidadHoras +
      " hora(s). Total a pagar: Bs " + total + ".",
    "ok"
  );

  formulario.reset();
  horas.value = 1;
});
