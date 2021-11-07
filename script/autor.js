$("#restart").click(function (e) {
  localStorage.clear();
  e.stopPropagation();
});
