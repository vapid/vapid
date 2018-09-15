document.addEventListener("turbolinks:load", () => {
  const $sidebar = $('.sidebar');
  const $main = $('main');

  $('.toggle-sidebar').click((e) => {
    e.preventDefault();
    e.stopPropagation()
    $('body').toggleClass('sidebar-open');
  });

  $sidebar.on('click', () => {
    $('body').removeClass('sidebar-open');
  });

  $main.on('click', () => {
    if ($('body').hasClass('sidebar-open')) {
      $('body').removeClass('sidebar-open');
    }
  });
});
