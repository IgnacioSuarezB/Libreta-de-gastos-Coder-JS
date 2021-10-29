//Proyecto Final, contador de gastos
//document.getElementById('r1').checked)

const personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido del grupo de personas

class Persona {
  //clase Principal
  //Agregar clase gastos con descripticon

  constructor(nombre, gastospropios, gastosgeneralpagado) {
    this.nombre = nombre;
    if (isNaN(gastospropios)) this.gastospropios = 0;
    //Asigna 0 gastos si no recibe parametros
    else this.gastospropios = gastospropios;
    if (isNaN(gastosgeneralpagado)) this.gastosgeneralpagado = 0;
    else {
      this.gastosgeneralpagado = gastosgeneralpagado;
      gastosgeneralesglobal += gastosgeneralpagado;
    }
    this.gastototal = this.gastospropios + this.gastosgeneralpagado;
    this.devolver =
      gastosgeneralesglobal / (personas.length + 1) - this.gastosgeneralpagado;
  }
  // Agrega Gastos Individuales
  agregargastoind(gastoind) {
    this.gastospropios += gastoind;
    this.gastototal += gastoind;
  }
  //Agrega gasto Grupales
  agregargastogrupal(gastogrupal) {
    this.gastosgeneralpagado += gastogrupal;
    this.gastototal += gastogrupal;
    gastosgeneralesglobal += gastogrupal;
    this.devolver =
      gastosgeneralesglobal / personas.length - gastosgeneralpagado;
  }
}

const $addPerson = document.getElementById("addBtn");
$addPerson.addEventListener("click", agregarPersona);

const $addGasto = document.getElementById("formGasto");
$addGasto.addEventListener("submit", agregarGasto);

function agregarPersona(e) {
  // Agrega la nueva persona al array y llama f para dibujar el html
  e.preventDefault();
  const $newperson = document.getElementById("addPerson");
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
  const $formGasto = document.getElementById("formGasto"); // ???
  const $gasto = document.getElementById("cantGasto");
  console.log($formGasto);
  //Chequear nombre y valor
  //Actualizar valores
  //Actualizar Card
  actualizarDebe();
  // Actualizar secc general
}

function agregarDOM(persona) {
  //Crea la carta de gasto de la nueva persona
  const $div = document.createElement("div");
  $div.classList.add("cardGastos");
  const $dom = document.getElementById("dom");
  $div.innerHTML += `<h4><b> ${persona.nombre}</b></h4> </br> 
    <p> Gastos individuales: $${persona.gastospropios} </p>
    <p> Gastos grupales: $${persona.gastosgeneralpagado} </p>
    <p> Gastos totales de ${persona.nombre}: $${persona.gastototal}</p>
    <p class='debe'> Debe: $${parseInt(persona.devolver)}</p>`;
  $dom.appendChild($div);
  actualizarDebe();
  //Agrega a la lista de Agregar Gastos
  const $optionList = document.getElementById("person-select");
  const $option = document.createElement("option");
  $option.textContent = persona.nombre;
  $option.value = persona.nombre;
  $optionList.appendChild($option);
}

function actualizarGeneral() {
  // Actualiza el DOM con los gastos generales
  const $gastoGeneral = document.getElementById("gastosGenerales");
  const $gastosGeneralCU = document.getElementById("gastosGeneralesCU");
  $gastoGeneral.textContent =
    "Los gastos Generales son $" + gastosgeneralesglobal;
  $gastosGeneralCU.textContent =
    "Cada persona debe pagar: $" +
    parseInt(gastosgeneralesglobal / personas.length);
}

function actualizarDebe() {
  // Actualiza todos los debe
  const $debe = document.querySelectorAll(".debe");
  $debe.forEach((valor, index) => {
    personas[index].devolver =
      gastosgeneralesglobal / personas.length -
      personas[index].gastosgeneralpagado;
    valor.textContent = "Debe: $" + personas[index].devolver.toFixed(2);
  });
}
