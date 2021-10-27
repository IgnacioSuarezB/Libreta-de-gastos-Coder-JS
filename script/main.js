//Proyecto Final, contador de gastos
const personas = [];
let gastosgeneralesglobal = 0; //Gasto compartido del grupo de personas
let bandera = true; //Bandera para no salir del bucle
let cantpersonas = 0;

class Persona {
  constructor(nombre) {
    this.nombre = nombre;
    this.gastospropios = 0;
    this.gastosgeneralpagado = 0;
    this.gastototal = 0;
  }
  agregargastoind(gastoind) {
    this.gastospropios += gastoind;
    this.gastototal += gastoind;
  }
  agregargastogrupal(gastogrupal) {
    this.gastosgeneralpagado += gastogrupal;
    this.gastototal += gastogrupal;
  }
}

function init() {
  cantpersonas = parseInt(prompt("Ingrese la cantidad de personas inicial"));
  for (let i = 0; i < cantpersonas; i++) {
    const nombre = prompt("Ingrese el nombre de las personas");
    personas.push(new Persona(nombre));
  }
}

function agregargastos() {
  for (let i = 0; i < cantpersonas; i++) {
    switch (
      prompt(
        "Quiere agregar gastos de " +
          personas[i].nombre +
          "? \n I : gastos individuales \n G : pagó un gastos grupales \n Ingrese cualquier otra cosas para saltear"
      ).toUpperCase()
    ) {
      case "I":
        bandera = true;
        while (bandera) {
          personas[i].agregargastoind(
            parseFloat(prompt("Ingrese el gasto individual"))
          );
          if ("N" === prompt("Posee otro gasto individual? Y/N").toUpperCase())
            bandera = false;
        }
        break;
      case "G":
        bandera = true;
        while (bandera) {
          let gastogrupal = parseFloat(
            prompt("Ingrese el gasto grupal que pagó")
          );
          personas[i].agregargastogrupal(gastogrupal);
          gastosgeneralesglobal += gastogrupal;
          if ("N" === prompt("Posee otro gasto grupal? Y/N").toUpperCase())
            bandera = false;
        }
        break;
      default:
        break;
    }
  }
}

//Desafio DOM
/*
function mostrarenDOM() {
  let $print = document.createElement("div");
  $print.innerHTML = "";
  let $div = document.getElementById("dom");
  for (const persona of personas) {
    $print.innerHTML += `<h4><b> ${persona.nombre}</b></h4> </br> 
    <p> Gastos individuales: ${persona.gastospropios} </p>
    <p> Gastos grupales: ${persona.gastosgeneralpagado} </p>
    <p> Gastos totales de ${persona.nombre}: ${persona.gastototal}</p></br>`;
  }
  $div.appendChild($print);
}
*/

// Desafio utilizando Fragment y agregando clases
function dibujarDOM() {
  const $fragment = document.createDocumentFragment(),
    $dom = document.getElementById("dom"),
    $div = document.createElement("div");
  personas.forEach((persona) => {
    const $divperson = document.createElement("div");
    $divperson.classList.add("cardGastos");
    $divperson.innerHTML = `<h4><b> ${persona.nombre}</b></h4> </br> 
    <p> Gastos individuales: ${persona.gastospropios} </p>
    <p> Gastos grupales: ${persona.gastosgeneralpagado} </p>
    <p> Gastos totales de ${persona.nombre}: ${persona.gastototal}</p></br>`;
    $fragment.appendChild($divperson);
  });
  $div.appendChild($fragment);
  $dom.appendChild($div);
}

function main() {
  init();
  console.log(personas);
  let bucle = true;
  while (bucle) {
    if ("N" === prompt("Desea agregar gastos? Y/N").toUpperCase()) {
      bucle = false;
    } else {
      agregargastos();
    }
  }
  //mostrarenDOM(); //Desafio DOM
  dibujarDOM();
}
main();
