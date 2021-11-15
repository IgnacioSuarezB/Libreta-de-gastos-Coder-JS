//Proyecto Final, contador de gastos
// V4 Agregando Storage y trabajando con jquery

let personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido por todo el grupo de personas
let dolarBlue = 0;
let rate = 1;
const $addPerson = document.getElementById("formPerson");
$addPerson.addEventListener("submit", agregarPersona);

const $addGasto = document.getElementById("formGasto");
$addGasto.addEventListener("submit", agregarGasto);

class Gasto {
  //clase Secundaria
  constructor(gasto, descripcion) {
    this.gasto = gasto;
    this.descripcion = descripcion;
    this.fecha = new Date();
  }
}
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
    if (!isNaN(gastospropio) && gastospropio !== 0) {
      this.gastosPropios.push(new Gasto(gastospropio, "I: Gasto inicial"));
      this.gastototal += gastospropio;
      this.gastopropio += gastospropio;
    }
    if (!isNaN(gastosgeneralpagado) && gastosgeneralpagado !== 0) {
      this.gastosGeneralesPagados.push(
        new Gasto(gastosgeneralpagado, "G: Gasto inicial")
      );
      this.gastototal += gastosgeneralpagado;
      this.gastogeneral += gastosgeneralpagado;
      gastosgeneralesglobal += gastosgeneralpagado;
    }
  }

  agregarGastoPropio(gastopropio, descripcion) {
    this.gastosPropios.push(new Gasto(gastopropio, "I: " + descripcion));
    this.gastototal += gastopropio;
    this.gastopropio += gastopropio;
  }

  agregarGastoGrupal(gastogrupal, descripcion) {
    this.gastosGeneralesPagados.push(
      new Gasto(gastogrupal, "G: " + descripcion)
    );
    this.gastototal += gastogrupal;
    this.gastogeneral += gastogrupal;
    gastosgeneralesglobal += gastogrupal;
    this.devolver = gastosgeneralesglobal / personas.length - this.gastogeneral;
  }
}

function agregarPersona(e) {
  // Agrega la nueva persona al array y llama dibuja en el html
  e.preventDefault();
  const $newperson = document.getElementById("addPerson");
  if (personas.find((alguien) => alguien.nombre === $newperson.value)) {
    alert($newperson.value + " ya existe");
    return;
  }
  const $newInd = document.getElementById("addGastoInd");
  const $newGrupal = document.getElementById("addGastoGrupal");
  personas.push(
    new Persona(
      $newperson.value,
      $newInd.valueAsNumber,
      $newGrupal.valueAsNumber
    )
  );
  agregarCard(personas[personas.length - 1]); //Agrega card
  actualizarGeneral(); // Actuliza secc general
  localStorage.setItem("storagePersonas", JSON.stringify(personas));
}

function agregarGasto(e) {
  //Agrega un gasto nuevo y actualiza el DOM
  e.preventDefault();
  const $personSelect = document.getElementById("person-select");
  const $radioInd = document.getElementById("individual");
  const $radioGrupal = document.getElementById("grupal");
  const $gasto = document.getElementById("cantGasto");
  const $descripcion = document.getElementById("description");
  if ($radioInd.checked) {
    personas[$personSelect.value].agregarGastoPropio(
      $gasto.valueAsNumber,
      $descripcion.value
    );
  } else if ($radioGrupal.checked) {
    personas[$personSelect.value].agregarGastoGrupal(
      $gasto.valueAsNumber,
      $descripcion.value
    );
  }
  actualizarCard($personSelect.value);
  actualizarDebe();
  actualizarGeneral();
  localStorage.setItem("storagePersonas", JSON.stringify(personas));
}

function agregarCard(persona) {
  //Crea la carta de gasto de la nueva persona
  const $div = document.createElement("div");
  $div.classList.add("cardGastos");
  $div.id = persona.nombre;
  const $dom = document.getElementById("dom");
  $div.innerHTML += `<h4 class="mb-4"><b> ${persona.nombre}</b></h4>  
    <p> Gastos individuales: $<ins>${
      persona.gastopropio.toFixed(2) / rate
    }</ins> </p>
    <p> Gastos grupales: $<ins>${
      persona.gastogeneral.toFixed(2) / rate
    }</ins> </p>
    <p> Gastos totales: $<ins>${persona.gastototal.toFixed(2) / rate}</ins></p>
    <p class='debe'> Debe: $${persona.devolver.toFixed(2) / rate}</p>`;
  $dom.appendChild($div);
  actualizarDebe();
  //Agrega a la lista de Agregar Gastos
  const $optionList = document.getElementById("person-select");
  const $option = document.createElement("option");
  $option.textContent = persona.nombre;
  $option.value = personas.length - 1;
  $optionList.appendChild($option);
}

function actualizarGeneral() {
  // Actualiza el DOM con los gastos generales
  const $gastoGeneral = document.getElementById("gastosGenerales");
  const $gastosGeneralCU = document.getElementById("gastosGeneralesCU");
  $gastoGeneral.textContent =
    "Los gastos Generales son $" + gastosgeneralesglobal / rate;
  $gastosGeneralCU.textContent =
    "Cada persona debe pagar: $" +
    (gastosgeneralesglobal / personas.length).toFixed(2) / rate;

  localStorage.setItem("storageGlobal", gastosgeneralesglobal);
}

function actualizarDebe() {
  // Actualiza todos los debe
  const $debe = document.querySelectorAll(".debe");
  $debe.forEach((valor, index) => {
    personas[index].devolver =
      gastosgeneralesglobal / personas.length - personas[index].gastogeneral;
    valor.textContent = "Debe: $" + personas[index].devolver.toFixed(2) / rate;
  });
}

function actualizarCard(position) {
  // Actualiza la card de una persona
  const persona = personas[position];
  const $nodeListGastos = document.querySelectorAll(`#${persona.nombre} ins`);
  $nodeListGastos[0].textContent = persona.gastopropio.toFixed(2) / rate;
  $nodeListGastos[1].textContent = persona.gastogeneral.toFixed(2) / rate;
  $nodeListGastos[2].textContent = persona.gastototal.toFixed(2) / rate;
}

function cargarDatos() {
  const storage = JSON.parse(localStorage.getItem("storagePersonas"));
  if (storage !== null) {
    gastosgeneralesglobal = JSON.parse(localStorage.getItem("storageGlobal"));
    storage.forEach((gente, index) => {
      personas.push(Object.assign(new Persona(), gente));
      agregarCard(personas[index]);
    });
    actualizarGeneral();
  }
  const URL = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
  $.get(URL, function (data) {
    dolarBlue = parseFloat(data[1].casa.venta);
    $("#dolar-text").text(dolarBlue);
  });
}

$(document).ready(cargarDatos());

// $("#btn-dolar").click(() => {
//   console.log(dolarBlue);
//   personas.forEach((value, index) => actualizarCard(index));
// });

$("#moneda").change(() => {
  console.log($("#moneda option:selected").val());
  if ($("#moneda option:selected").val() === "pesos") {
    rate = 1;
  } else if ($("#moneda option:selected").val() === "dolar") {
    rate = dolarBlue;
  }
  actualizarGeneral();
  personas.forEach((value, index) => actualizarCard(index));
});
