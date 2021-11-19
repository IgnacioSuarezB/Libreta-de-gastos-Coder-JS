// Variables, clases y funciones Globales que se utilizan en otros scritps

let personas = []; //Array de objetos con todos los datos
let gastosgeneralesglobal = 0; //Gasto compartido por todo el grupo de personas
let dolarBlue = 0; // Valor del dolar
let rate = 1; // Ratio de conversion del dolar

//clase Secundaria
class Gasto {
  constructor(gasto, descripcion) {
    this.gasto = gasto;
    this.descripcion = descripcion;
    this.fecha = new Date();
  }
}

//clase Principal
class Persona {
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

  //Metodos para agregar Gastos
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

// Llamado a la API del dolar
function cargarDolar() {
  const URL = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
  $.get(URL, function (data) {
    dolarBlue = parseFloat(data[1].casa.venta);
    $("#dolar-text").text(dolarBlue);
  });
}
