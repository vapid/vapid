const jQuery = require('jquery');
window.$ = window.jQuery = jQuery;

require('brace');

// TODO: Include as packages
require('../vendor/semantic-ui/semantic.min');
require('../vendor/trix/trix');
require('../vendor/jquery.tablesort');

require('./dashboard/ace');
require('./dashboard/hideMessage');
require('./dashboard/range');
require('./dashboard/semantic');
require('./dashboard/sidebar');
require('./dashboard/websocket');
