const sess = require('koa-generic-session');
const MemoryStore = require('koa-generic-session/lib/memory_store');

const sessKey = 'vapid:sess';
const store = new MemoryStore();

/**
 * Initializes the session
 *
 * @param {Object} app
 * @return {function}
 */
module.exports = async (ctx, next) => sess({
  key: sessKey,
  store,
})(ctx, next);
