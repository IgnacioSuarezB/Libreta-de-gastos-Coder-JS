//Proyecto Final, contador de gastos
const personas = [];
let gastosgeneralesglobal = 0; //Gasto compartido del grupo de personas
let bandera = true; //Bandera para no salir del bucle
let cantpersonas = 0;

function AgregarPersona() {
  event.preventDefault();
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
  console.log(personas);
  agregarDOM(personas[personas.length - 1]);
  generalDOM();
}

const $addPerson = document.getElementById("addBtn");
$addPerson.addEventListener("click", AgregarPersona);

class Persona {
  constructor(nombre, gastospropios, gastosgeneralpagado) {
    this.nombre = nombre;
    if (isNaN(gastospropios)) this.gastospropios = 0;
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
  agregargastoind(gastoind) {
    this.gastospropios += gastoind;
    this.gastototal += gastoind;
  }
  agregargastogrupal(gastogrupal) {
    this.gastosgeneralpagado += gastogrupal;
    this.gastototal += gastogrupal;
    gastosgeneralesglobal += gastogrupal;
    this.devolver =
      gastosgeneralesglobal / personas.length - gastosgeneralpagado;
  }
}

function agregarDOM(persona) {
  const $div = document.createElement("div");
  $div.classList.add("cardGastos");
  const $dom = document.getElementById("dom");
  $div.innerHTML += `<h4><b> ${persona.nombre}</b></h4> </br> 
    <p> Gastos individuales: $${persona.gastospropios} </p>
    <p> Gastos grupales: $${persona.gastosgeneralpagado} </p>
    <p> Gastos totales de ${persona.nombre}: $${persona.gastototal}</p>
    <p class='debe'> Debe: $${parseInt(persona.devolver)}</p>`;
  $dom.appendChild($div);
  const $debe = document.querySelectorAll(".debe");
  console.log($debe);
  $debe.forEach((valor, index) => {
    personas[index].devolver =
      gastosgeneralesglobal / personas.length -
      personas[index].gastosgeneralpagado;
    valor.textContent = "Debe: $" + personas[index].devolver.toFixed(2);
  });
}

function generalDOM() {
  const $gastoGeneral = document.getElementById("gastosGenerales");
  const $gastosGeneralCU = document.getElementById("gastosGeneralesCU");
  $gastoGeneral.textContent =
    "Los gastos Generales son $" + gastosgeneralesglobal;
  $gastosGeneralCU.textContent =
    "Cada persona debe pagar: $" +
    parseInt(gastosgeneralesglobal / personas.length);
}
