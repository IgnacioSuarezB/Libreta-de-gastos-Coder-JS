let personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido por todo el grupo de personas

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
      //agregarCard(personas[index]);
      const $option = document.createElement("option");
      $option.textContent = gente.nombre;
      $option.value = index;
      $optionList.appendChild($option);
    });
    //actualizarGeneral();
  }
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
  <td>${gasto.gasto}</td>
  <td>${
    fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
  }</td>
  <td>${gasto.descripcion}</td>
</tr>`);
  });
}
$(document).ready(cargarDatos());
$("#person-select").on("change", function () {
  cargarDetalles($("#person-select").val());
});
