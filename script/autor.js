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
