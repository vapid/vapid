const sess = require('koa-session');

const sessKey = 'vapid:sess';

/**
 * Initializes the session
 *
 * @param {Object} app
 * @return {function}
 */
module.exports = function session(app) {
  return sess({ key: sessKey }, app);
};
