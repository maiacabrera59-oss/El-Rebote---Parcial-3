const API_URL = "http://localhost:3000/api";

const formulario = document.querySelector("#form-reserva");
const comboCanchas = document.querySelector("#cancha");
const listaReservas = document.querySelector("#lista-reservas");
const tablaRecaudacion = document.querySelector("#tabla-recaudacion");
const mensaje = document.querySelector("#mensaje");

const formatearPrecio = (valor) => {
  const numero = Number(valor);

  if (isNaN(numero)) {
    return "$ 0,00";
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(numero);
};

const mostrarMensaje = (texto, esError = false) => {
  mensaje.textContent = texto;
  mensaje.style.color = esError ? "#d32f2f" : "#2e7d32";
};

const cargarCanchas = async () => {
  try {
    const res = await fetch(`${API_URL}/canchas`);

    if (!res.ok) {
      throw new Error("Error al consultar las canchas");
    }

    const canchas = await res.json();

    comboCanchas.innerHTML =
      '<option value="">Seleccione una cancha</option>';

    canchas.forEach((cancha) => {
      const id = cancha.idCancha ?? cancha.IdCancha;
      const nombre = cancha.nombre ?? cancha.Nombre;

      const precio =
        cancha.precioPorHora ??
        cancha.PrecioPorHora ??
        cancha.precio ??
        cancha.Precio ??
        0;

      const option = document.createElement("option");

      option.value = id;

      option.textContent =
        `${nombre} - ${formatearPrecio(precio)} por hora`;

      comboCanchas.appendChild(option);
    });
  } catch (error) {
    mostrarMensaje(
      "No se pudieron cargar las canchas disponibles.",
      true
    );
  }
};

const cargarReservas = async () => {
  try {
    const res = await fetch(`${API_URL}/reservas`);

    if (!res.ok) {
      throw new Error("Error al consultar las reservas");
    }

    const reservas = await res.json();

    listaReservas.innerHTML = "";

    if (!reservas || reservas.length === 0) {
      listaReservas.innerHTML =
        "<p>No hay reservas registradas.</p>";
      return;
    }

    reservas.forEach((reserva) => {
      const id =
        reserva.idReserva ??
        reserva.IdReserva;

      const cancha =
        reserva.cancha ??
        reserva.Cancha ??
        "Sin cancha";

      const cliente =
        reserva.cliente ??
        reserva.Cliente ??
        "Sin cliente";

      const fecha =
        reserva.fecha ??
        reserva.Fecha;

      const hora =
        reserva.hora ??
        reserva.Hora;

      const pagada =
        reserva.pagada ??
        reserva.Pagada ??
        false;

      const precio =
        reserva.precioPorHora ??
        reserva.PrecioPorHora ??
        reserva.precio ??
        reserva.Precio ??
        0;

      const fechaFormateada = new Date(fecha).toLocaleDateString(
        "es-AR",
        {
          timeZone: "UTC"
        }
      );

      const tarjeta = document.createElement("article");

      tarjeta.className =
        `tarjeta ${pagada ? "pagada" : "pendiente"}`;

      tarjeta.innerHTML = `
        <h3>${cancha}</h3>

        <p>
          <strong>Cliente:</strong> ${cliente}
        </p>

        <p>
          <strong>Fecha:</strong> ${fechaFormateada}
        </p>

        <p>
          <strong>Hora:</strong> ${hora} hs
        </p>

        <p>
          <strong>Precio por hora:</strong>
          ${formatearPrecio(precio)}
        </p>

        <p>
          <strong>Estado:</strong>
          ${pagada ? "Pagada" : "Pendiente"}
        </p>

        ${!pagada
          ? `
              <button
                type="button"
                class="btn-pago"
                data-id="${id}"
              >
                Marcar como pagada
              </button>
            `
          : ""
        }
      `;

      listaReservas.appendChild(tarjeta);
    });
  } catch (error) {
    listaReservas.innerHTML =
      "<p>Error al cargar el listado de reservas.</p>";
  }
};

const cargarRecaudacion = async () => {
  try {
    const res = await fetch(
      `${API_URL}/reportes/recaudacion`
    );

    if (!res.ok) {
      throw new Error("Error al consultar la recaudación");
    }

    const reportes = await res.json();

    tablaRecaudacion.innerHTML = "";

    if (!reportes || reportes.length === 0) {
      tablaRecaudacion.innerHTML = `
        <tr>
          <td colspan="5">
            No hay datos de recaudación.
          </td>
        </tr>
      `;
      return;
    }

    reportes.forEach((item) => {
      const cancha =
        item.Cancha ?? "Sin cancha";

      const cantidadReservas =
        item.CantidadReservas ?? 0;

      const totalCobrado =
        item.TotalCobrado ?? 0;

      const totalPendiente =
        item.TotalPendiente ?? 0;

      const totalGeneral =
        item.TotalGeneral ?? 0;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cancha}</td>
        <td>${cantidadReservas}</td>
        <td>${formatearPrecio(totalCobrado)}</td>
        <td class="pendiente">${formatearPrecio(totalPendiente)}</td>
        <td>${formatearPrecio(totalGeneral)}</td>
      `;

      tablaRecaudacion.appendChild(tr);
    });
  } catch (error) {
    console.error("Error:", error);

    tablaRecaudacion.innerHTML = `
      <tr>
        <td colspan="5">
          Error al cargar la tabla de recaudación.
        </td>
      </tr>
    `;
  }
};

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  mostrarMensaje("");

  const formData = new FormData(formulario);

  const datosReserva = {
    IdCancha: Number(formData.get("idCancha")),
    Cliente: formData.get("cliente")?.trim(),
    Fecha: formData.get("fecha"),
    Hora: formData.get("hora")
  };

  try {
    const res = await fetch(
      `${API_URL}/reservas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosReserva)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje(
        data.mensaje ||
        "Ocurrió un error al registrar la reserva.",
        true
      );
      return;
    }

    mostrarMensaje(
      data.mensaje ||
      "Reserva registrada con éxito."
    );

    formulario.reset();

    await Promise.all([
      cargarReservas(),
      cargarRecaudacion()
    ]);
  } catch (error) {
    mostrarMensaje(
      "Error al conectar con el servidor.",
      true
    );
  }
});

listaReservas.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btn-pago")) {
    return;
  }

  const idReserva = e.target.dataset.id;

  mostrarMensaje("");

  try {
    const res = await fetch(
      `${API_URL}/reservas/${idReserva}/pago`,
      {
        method: "PUT"
      }
    );

    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje(
        data.mensaje ||
        "No se pudo registrar el pago.",
        true
      );
      return;
    }

    mostrarMensaje(
      data.mensaje ||
      "Pago registrado con éxito."
    );

    await Promise.all([
      cargarReservas(),
      cargarRecaudacion()
    ]);
  } catch (error) {
    mostrarMensaje(
      "Error al conectar con el servidor para registrar el pago.",
      true
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarCanchas();
  cargarReservas();
  cargarRecaudacion();
});