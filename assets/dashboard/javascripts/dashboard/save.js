const $form = document.querySelector('.ui.record.form');

if ($form) {
  // Submit the form if someone presses Cmd+S
  document.addEventListener('keydown', function(e) {
    if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      $form.submit();
    }
  }, false);
}
