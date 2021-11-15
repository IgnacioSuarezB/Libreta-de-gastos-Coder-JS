let personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido por todo el grupo de personas
let rate = 1;
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
function eliminarGasto(indexPersona, indexGasto) {
  //console.log("anda");
  const longPropio = personas[indexPersona].gastosPropios.length;
  if (longPropio > indexGasto) {
    //Gastos Propio
    personas[indexPersona].gastopropio -=
      personas[indexPersona].gastosPropios[indexGasto].gasto;
    personas[indexPersona].gastototal -=
      personas[indexPersona].gastosPropios[indexGasto].gasto;
    //console.log("Gastos Propio");
    //console.log(personas[indexPersona].gastopropio);
    personas[indexPersona].gastosPropios.splice(indexGasto, 1);
  } else if (longPropio <= indexGasto) {
    //Gastos Grupales
    personas[indexPersona].gastogeneral -=
      personas[indexPersona].gastosGeneralesPagados[
        indexGasto - longPropio
      ].gasto;

    personas[indexPersona].gastototal -=
      personas[indexPersona].gastosGeneralesPagados[
        indexGasto - longPropio
      ].gasto;

    gastosgeneralesglobal -=
      personas[indexPersona].gastosGeneralesPagados[indexGasto - longPropio]
        .gasto;
    //console.log("Gastos General");
    //console.log(personas[indexPersona].gastogeneral);
    personas[indexPersona].gastosGeneralesPagados.splice(
      indexGasto - longPropio,
      1
    );
  }
  cargarDetalles(indexPersona);
  calcularDevolver();
  localStorage.setItem("storagePersonas", JSON.stringify(personas));
  localStorage.setItem("storageGlobal", gastosgeneralesglobal);
}

function cargarDetalles(seleccionado) {
  $("#tabla-gastos").empty();
  const todosLosGastos = personas[seleccionado].gastosPropios.concat(
    personas[seleccionado].gastosGeneralesPagados
  );
  //console.log(todosLosGastos);
  todosLosGastos.forEach((gasto, index) => {
    // console.log(gasto);
    fecha = Object.assign(new Date(), gasto.fecha);
    $("#tabla-gastos").append(`<tr>
  <th scope="row">${index + 1}</th>
  <td>${gasto.gasto / rate}</td>
  <td>${
    fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
  }</td>
  <td>${gasto.descripcion}</td>
  <td > <button type="button" class="btn btn-danger eliminar" value="${index}">X</button></td>
</tr>`);
  });
}
function calcularDevolver() {
  personas.forEach((cada) => {
    cada.devolver = gastosgeneralesglobal / personas.length - cada.gastogeneral;
  });
}

$(document).ready(cargarDatos());

$("#person-select").on("change", function () {
  cargarDetalles($("#person-select").val());
});

$("#tabla-gastos").click(function (e) {
  console.log(e.target.classList.contains("eliminar"));
  if (e.target.classList.contains("eliminar")) {
    console.log($("#person-select").val(), e.target.value);
    eliminarGasto($("#person-select").val(), e.target.value);
  }
  e.stopPropagation();
});

$("#eliminar-persona").click(function (e) {
  personas.splice($("#person-select").val(), 1);
  gastosgeneralesglobal = 0;
  personas.forEach((persona) => {
    gastosgeneralesglobal += persona.gastogeneral;
  });
  console.log(gastosgeneralesglobal);
  calcularDevolver();
  localStorage.setItem("storagePersonas", JSON.stringify(personas));
  localStorage.setItem("storageGlobal", gastosgeneralesglobal);
  location.reload();
  e.stopPropagation();
});

$("#moneda").change(() => {
  console.log($("#moneda option:selected").val());
  if ($("#moneda option:selected").val() === "pesos") {
    rate = 1;
    if ($("#person-select").val() !== "") {
      cargarDetalles($("#person-select").val());
    }
  } else if ($("#moneda option:selected").val() === "dolar") {
    rate = dolarBlue;
    if ($("#person-select").val() !== "") {
      cargarDetalles($("#person-select").val());
    }
  }
});
