//Se elimina todos los datos guardados en LocalStorage y
// realiza una pequeña animación

$("#restart").click(function (e) {
  localStorage.clear();
  e.stopPropagation();
  $(".trash-svg")
    .fadeOut("slow")
    .css({ color: "red", opacity: "1" })
    .fadeIn("slow")
    .fadeOut("slow")
    .fadeIn("slow")
    .animate({ opacity: "0.6" }, "slow");
});

$(".trash-svg").hide();
$(document).ready(cargarDolar());
