const jQuery = require('jquery');
window.$ = window.jQuery = jQuery;

// TODO: Include as packages
require('../vendor/semantic-ui/semantic.min');
require('../vendor/trix/trix');
require('../vendor/jquery.tablesort');

require('./dashboard/ace');
require('./dashboard/hideMessage');
require('./dashboard/range');
require('./dashboard/save');
require('./dashboard/semantic');
require('./dashboard/sidebar');
require('./dashboard/sortable');
require('./dashboard/websocket');

// CSRF
$.ajaxSetup({
  headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
});
