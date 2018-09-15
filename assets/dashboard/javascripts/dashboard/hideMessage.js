document.addEventListener("turbolinks:load", () => {
  $('.form').submit(() => {
    $('.ui.message').hide();
  });
});
