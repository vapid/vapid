$('[data-toggle=sidebar]').click((e) => {
  e.preventDefault();
  $('.ui.sidebar').sidebar('toggle');
});