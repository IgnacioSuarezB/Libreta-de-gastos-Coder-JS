//Proyecto Final, contador de gastos
// V3 Con clase Gasto y agregarGasto()
//document.getElementById('r1').checked) funciona

const personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido del grupo de personas

class Gasto {
  //clase Principal
  constructor(gasto, descripcion) {
    this.gasto = gasto;
    this.descripcion = descripcion;
  }
}
class Persona {
  //clase Principal
  //Agregar clase gastos con descripticon

  constructor(nombre, gastospropio, gastosgeneralpagado) {
    this.nombre = nombre;
    this.gastosPropios = [];
    this.gastosGeneralesPagados = [];
    this.gastopropio = 0;
    this.gastogeneral = 0;
    this.gastototal = 0;
    this.devolver = 0;
    if (!isNaN(gastospropio)) {
      //agregarGastoPropio(gastospropio, "Gasto inicial propio");
      this.gastosPropios.push(new Gasto(gastospropio, "Gasto inicial propio"));
      this.gastototal += gastospropio;
      this.gastopropio += gastospropio;
    }
    if (!isNaN(gastosgeneralpagado)) {
      //agregarGastoGrupal(gastosgeneralpagado, "Gasto inicial general");
      this.gastosGeneralesPagados.push(
        new Gasto(gastosgeneralpagado, "Gasto inicial grupal")
      );
      this.gastototal += gastosgeneralpagado;
      this.gastogeneral += gastosgeneralpagado;
      gastosgeneralesglobal += gastosgeneralpagado;
    }
    // this.gastototal = this.gastospropio + this.gastosgeneralpagado;
    // this.devolver =
    //   gastosgeneralesglobal / (personas.length + 1) - this.gastosgeneralpagado;
    // Hay q ver los gastos Global
  }
  // Agrega Gastos Individuales
  agregarGastoPropio(gastopropio, descripcion) {
    this.gastosPropios.push(new Gasto(gastopropio, descripcion));
    this.gastototal += gastopropio;
    this.gastopropio += gastopropio;
  }
  //Agrega gasto Grupales
  agregarGastoGrupal(gastogrupal, descripcion) {
    this.gastosGeneralesPagados.push(new Gasto(gastogrupal, descripcion));
    this.gastototal += gastogrupal;
    this.gastogeneral += gastogrupal;
    gastosgeneralesglobal += gastogrupal;
    this.devolver = gastosgeneralesglobal / personas.length - this.gastogeneral;
  }
}

const $addPerson = document.getElementById("formPerson");
$addPerson.addEventListener("submit", agregarPersona);

const $addGasto = document.getElementById("formGasto");
$addGasto.addEventListener("submit", agregarGasto);

function agregarPersona(e) {
  // Agrega la nueva persona al array y llama f para dibujar el html
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
  agregarDOM(personas[personas.length - 1]); //Agrega card
  actualizarGeneral(); // Actuliza secc general
}

function agregarGasto(e) {
  //Agrega un gasto nuevo
  e.preventDefault();
  const $personSelect = document.getElementById("person-select");
  const $radioInd = document.getElementById("individual");
  const $radioGrupal = document.getElementById("grupal");
  const $gasto = document.getElementById("cantGasto");
  console.log($radioInd.checked);
  console.log($radioGrupal.checked);
  //Agregar Referencia de descripcion
  if ($radioInd.checked) {
    personas[$personSelect.value].agregarGastoPropio(
      $gasto.valueAsNumber,
      "descripcion"
    );
  }
  if ($radioGrupal.checked) {
    personas[$personSelect.value].agregarGastoGrupal(
      $gasto.valueAsNumber,
      "descripcion"
    );
  }
  console.log(personas);
  //Actualizar Card
  actualizarDebe();
  actualizarGeneral();
}

function agregarDOM(persona) {
  //Crea la carta de gasto de la nueva persona
  const $div = document.createElement("div");
  $div.classList.add("cardGastos");
  const $dom = document.getElementById("dom");
  $div.innerHTML += `<h4><b> ${persona.nombre}</b></h4> </br> 
    <p> Gastos individuales: $${persona.gastopropio.toFixed(2)} </p>
    <p> Gastos grupales: $${persona.gastogeneral.toFixed(2)} </p>
    <p> Gastos totales: $${persona.gastototal.toFixed(2)}</p>
    <p class='debe'> Debe: $${persona.devolver.toFixed(2)}</p>`;
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
    "Los gastos Generales son $" + gastosgeneralesglobal;
  $gastosGeneralCU.textContent =
    "Cada persona debe pagar: $" + gastosgeneralesglobal / personas.length;
}

function actualizarDebe() {
  // Actualiza todos los debe
  const $debe = document.querySelectorAll(".debe");
  $debe.forEach((valor, index) => {
    personas[index].devolver =
      gastosgeneralesglobal / personas.length - personas[index].gastogeneral;
    valor.textContent = "Debe: $" + personas[index].devolver.toFixed(2);
  });
}
