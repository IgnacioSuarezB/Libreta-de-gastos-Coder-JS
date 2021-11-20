//Proyecto Final, contador de gastos personal

const $addPerson = document.getElementById("formPerson");
$addPerson.addEventListener("submit", agregarPersona);

const $addGasto = document.getElementById("formGasto");
$addGasto.addEventListener("submit", agregarGasto);

$(document).ready(cargarDatos());

function cargarDatos() {
  // Carga los datos desde el Storage y callback a la api
  const storage = JSON.parse(localStorage.getItem("storagePersonas"));
  if (storage !== null) {
    gastosgeneralesglobal = JSON.parse(localStorage.getItem("storageGlobal"));
    storage.forEach((gente, index) => {
      personas.push(Object.assign(new Persona(), gente));
      agregarCard(personas[index]);
    });
    actualizarGeneral();
  }
  cargarDolar();
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
  $addPerson.reset();
  $("#toast-person").show("slow");
  setTimeout(function () {
    $("#toast-person").hide("slow");
  }, 3000);
  $("html, body").animate(
    {
      scrollTop: $("body").offset().top,
    },
    500
  );
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
  $addGasto.reset();
  $("#toast-gasto").show("slow");
  setTimeout(function () {
    $("#toast-gasto").hide("slow");
  }, 3000);
}

function agregarCard(persona) {
  //Crea la carta de gasto de la nueva persona
  const $div = document.createElement("div");
  $div.classList.add("cardGastos");
  $div.id = persona.nombre;
  const $dom = document.getElementById("dom");
  $div.innerHTML += `<h4 class="mb-4"><b> ${persona.nombre}</b></h4>  
    <p> Gastos individuales: $<ins>${(persona.gastopropio / rate).toFixed(
      2
    )}</ins> </p>
    <p> Gastos grupales: $<ins>${(persona.gastogeneral / rate).toFixed(
      2
    )}</ins> </p>
    <p> Gastos totales: $<ins>${(persona.gastototal / rate).toFixed(
      2
    )}</ins></p>
    <p class='debe'> Debe: $${(persona.devolver / rate).toFixed(2)}</p>`;
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
    "Los gastos Generales son $" + (gastosgeneralesglobal / rate).toFixed(2);
  $gastosGeneralCU.textContent =
    "Cada persona debe pagar: $" +
    (gastosgeneralesglobal / personas.length / rate).toFixed(2);

  localStorage.setItem("storageGlobal", gastosgeneralesglobal);
}

function actualizarDebe() {
  // Actualiza todos los debe
  const $debe = document.querySelectorAll(".debe");
  $debe.forEach((valor, index) => {
    personas[index].devolver =
      gastosgeneralesglobal / personas.length - personas[index].gastogeneral;
    valor.textContent =
      "Debe: $" + (personas[index].devolver / rate).toFixed(2);
  });
}

function actualizarCard(position) {
  // Actualiza la card de una persona
  const persona = personas[position];
  const $nodeListGastos = document.querySelectorAll(`#${persona.nombre} ins`);
  $nodeListGastos[0].textContent = (persona.gastopropio / rate).toFixed(2);
  $nodeListGastos[1].textContent = (persona.gastogeneral / rate).toFixed(2);
  $nodeListGastos[2].textContent = (persona.gastototal / rate).toFixed(2);
}

$("#moneda").change(() => {
  // Lógica para la api dolar
  if ($("#moneda option:selected").val() === "pesos") {
    rate = 1;
  } else if ($("#moneda option:selected").val() === "dolar") {
    rate = dolarBlue;
  }
  actualizarGeneral();
  personas.forEach((value, index) => actualizarCard(index));
  actualizarDebe();
});
