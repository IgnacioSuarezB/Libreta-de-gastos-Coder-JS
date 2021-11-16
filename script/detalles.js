let personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido por todo el grupo de personas
let rate = 1; // ratio de conversión del dolar (1 => no hay conversión)
let todosLosGastos = [];
let gastosOrdenados = [];
let banderaGastos = true; // Click en gasto
let banderaFecha = false; // Click en fecha
class Persona {
  //clase Principal
  constructor(nombre, gastospropio, gastosgeneralpagado) {
    this.nombre = nombre;
    this.gastosPropios = [];
    this.gastosGeneralesPagados = [];
    this.gastopropio = 0;
    this.gastogeneral = 0;
    this.gastototal = 0;
    this.devolver = 0;
    if (!isNaN(gastospropio)) {
      this.gastosPropios.push(new Gasto(gastospropio, "Gasto inicial propio"));
      this.gastototal += gastospropio;
      this.gastopropio += gastospropio;
    }
    if (!isNaN(gastosgeneralpagado)) {
      this.gastosGeneralesPagados.push(
        new Gasto(gastosgeneralpagado, "Gasto inicial grupal")
      );
      this.gastototal += gastosgeneralpagado;
      this.gastogeneral += gastosgeneralpagado;
      gastosgeneralesglobal += gastosgeneralpagado;
    }
  }

  agregarGastoPropio(gastopropio, descripcion) {
    this.gastosPropios.push(new Gasto(gastopropio, descripcion));
    this.gastototal += gastopropio;
    this.gastopropio += gastopropio;
  }

  agregarGastoGrupal(gastogrupal, descripcion) {
    this.gastosGeneralesPagados.push(new Gasto(gastogrupal, descripcion));
    this.gastototal += gastogrupal;
    this.gastogeneral += gastogrupal;
    gastosgeneralesglobal += gastogrupal;
    this.devolver = gastosgeneralesglobal / personas.length - this.gastogeneral;
  }
}

// Carga los datos desde el Storage
function cargarDatos() {
  const storage = JSON.parse(localStorage.getItem("storagePersonas"));
  if (storage !== null) {
    gastosgeneralesglobal = JSON.parse(localStorage.getItem("storageGlobal"));
    const $optionList = document.getElementById("person-select");
    storage.forEach((gente, index) => {
      personas.push(Object.assign(new Persona(), gente));
      const $option = document.createElement("option");
      $option.textContent = gente.nombre;
      $option.value = index;
      $optionList.appendChild($option);
    });
  }
  const URL = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
  $.get(URL, function (data) {
    dolarBlue = parseFloat(data[1].casa.venta);
    $("#dolar-text").text(dolarBlue);
  });
}

// Elimina un gasto en particular
function eliminarGasto(indexPersona, fechaGasto) {
  // Busco la fecha en los gastos propios
  let indexGastoPropio = personas[indexPersona].gastosPropios.findIndex(
    function (gasto) {
      return gasto.fecha.toString() === fechaGasto.toString();
    }
  );
  // Busco la fecha en los gastos generales
  let indexGastoGrupal = personas[
    indexPersona
  ].gastosGeneralesPagados.findIndex(function (gasto) {
    return gasto.fecha.toString() === fechaGasto.toString();
  });
  // Me fijo cual es
  if (indexGastoGrupal === -1) {
    //Gastos Propio
    personas[indexPersona].gastopropio -=
      personas[indexPersona].gastosPropios[indexGastoPropio].gasto;

    personas[indexPersona].gastototal -=
      personas[indexPersona].gastosPropios[indexGastoPropio].gasto;

    personas[indexPersona].gastosPropios.splice(indexGastoPropio, 1);
  } else {
    //Gastos Grupales
    personas[indexPersona].gastogeneral -=
      personas[indexPersona].gastosGeneralesPagados[indexGastoGrupal].gasto;

    personas[indexPersona].gastototal -=
      personas[indexPersona].gastosGeneralesPagados[indexGastoGrupal].gasto;

    gastosgeneralesglobal -=
      personas[indexPersona].gastosGeneralesPagados[indexGastoGrupal].gasto;

    personas[indexPersona].gastosGeneralesPagados.splice(indexGastoGrupal, 1);
  }
  // Elimino el gasto en cache
  gastosOrdenados.splice(
    gastosOrdenados.findIndex(function (gasto) {
      return gasto.fecha.toString() === fechaGasto.toString();
    }),
    1
  );
  cargarDetalles();
  calcularDevolver();
  localStorage.setItem("storagePersonas", JSON.stringify(personas));
  localStorage.setItem("storageGlobal", gastosgeneralesglobal);
}

// Dibuja en el DOM cada gasto
function cargarDetalles() {
  $("#tabla-gastos").empty();
  gastosOrdenados.forEach((gasto, index) => {
    fecha = Object.assign(new Date(), gasto.fecha);
    $("#tabla-gastos").append(`<tr>
  <th scope="row">${index + 1}</th>
  <td>${(gasto.gasto / rate).toFixed(2)}</td>
  <td>${
    fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
  }</td>
  <td>${gasto.descripcion}</td>
  <td > <button type="button" class="btn btn-danger eliminar" value="${
    gasto.fecha
  }">X</button></td>
</tr>`);
  });
}

// Actualiza devolver
function calcularDevolver() {
  personas.forEach((cada) => {
    cada.devolver = gastosgeneralesglobal / personas.length - cada.gastogeneral;
  });
}

// Carga las personas y gastos de storage
$(document).ready(cargarDatos());

// Se muestra los detalle de los gasto de una persona
$("#person-select").on("change", function () {
  let seleccionado = $("#person-select").val();
  if (seleccionado === "") $("#tabla-gastos").empty();
  else {
    // Creo el array de todos los gastos
    todosLosGastos = personas[seleccionado].gastosPropios.concat(
      personas[seleccionado].gastosGeneralesPagados
    );
    // Ordeno el array por fecha, más nuevos primeros
    gastosOrdenados = todosLosGastos.sort(
      (a, b) => new Date(a.fecha).getTime() < new Date(b.fecha).getTime()
    );
    cargarDetalles();
  }
});

// Elimina un gasto
$("#tabla-gastos").click(function (e) {
  if (e.target.classList.contains("eliminar")) {
    eliminarGasto($("#person-select").val(), e.target.value);
  }
  e.stopPropagation();
});

// Se elimina una persona
$("#eliminar-persona").click(function (e) {
  personas.splice($("#person-select").val(), 1);
  gastosgeneralesglobal = 0;
  personas.forEach((persona) => {
    gastosgeneralesglobal += persona.gastogeneral;
  });
  calcularDevolver();
  localStorage.setItem("storagePersonas", JSON.stringify(personas));
  localStorage.setItem("storageGlobal", gastosgeneralesglobal);
  location.reload();
  e.stopPropagation();
});

// Lógica para la api dolar
$("#moneda").change(() => {
  if ($("#moneda option:selected").val() === "pesos") {
    rate = 1;
    if ($("#person-select").val() !== "") {
      cargarDetalles();
    }
  } else if ($("#moneda option:selected").val() === "dolar") {
    rate = dolarBlue;
    if ($("#person-select").val() !== "") {
      cargarDetalles();
    }
  }
});

// Ordenar por precio de gastos
$("#orden-gasto").click(() => {
  banderaGastos ? (banderaGastos = false) : (banderaGastos = true);
  if (banderaGastos)
    gastosOrdenados = gastosOrdenados.sort((a, b) => a.gasto - b.gasto);
  else gastosOrdenados = gastosOrdenados.sort((a, b) => b.gasto - a.gasto);
  cargarDetalles();
});

// Ordenar por Fecha
$("#orden-fecha").click(() => {
  banderaFecha ? (banderaFecha = false) : (banderaFecha = true);
  if (banderaFecha)
    gastosOrdenados = gastosOrdenados.sort(
      (a, b) => new Date(a.fecha).getTime() > new Date(b.fecha).getTime()
    );
  else
    gastosOrdenados = gastosOrdenados.sort(
      (a, b) => new Date(a.fecha).getTime() < new Date(b.fecha).getTime()
    );
  cargarDetalles();
});
