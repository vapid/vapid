let $form;

function autosave(e) {
  if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    $form.submit();
  }
}

document.addEventListener("turbolinks:load", () => {
  $form = document.querySelector('form[data-autosave]');
  $form && document.addEventListener('keydown', autosave, false);
});
