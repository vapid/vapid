if ('WebSocket' in window) {
  const ws = new WebSocket('ws://localhost:3000/livereload');
  const $build = $('.ui.build.message');

  ws.onmessage = (evt) => {
    const { command } = JSON.parse(evt.data);
    const isDirty = command === 'dirty';

    if (isDirty) {
      $('.ui.flash').remove();
    }

    $build.toggleClass('hidden', !isDirty);
  };
}