$('input[type=range]').on('input', function () {
  $(this).next('.label').text( $(this).val() );
});
