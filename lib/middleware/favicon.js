const fs = require('fs');
const path = require('path');
const Utils = require('../utils');

/**
 * Returns the first favicon found in the supplied paths
 *
 * @param {array} [paths=[]]
 * @parms {Object} options
 * @return {function|boolean}
 */
module.exports = function favicon(paths = [], options = {}) {
  const faviconPath = '/favicon.ico';
  const maxAge = options.maxAge === null
    ? 86400000
    : Math.min(Math.max(0, options.maxAge), 31556926000);
  const cacheControl = `public, max-age=${maxAge / 1000 | 0}`; // eslint-disable-line no-bitwise
  let icon;
  let filePath;

  return (ctx, next) => {
    if (ctx.path !== faviconPath) {
      return next();
    }

    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
      ctx.status = ctx.method === 'OPTIONS' ? 200 : 405;
      ctx.set('Allow', 'GET, HEAD, OPTIONS');
    } else {
      Utils.each(paths, (p) => {
        filePath = path.join(p, faviconPath);
        try {
          icon = fs.readFileSync(filePath);
        } catch (err) { /* Do nothing */ }
        if (icon) return false;

        return true;
      });

      ctx.set('Cache-Control', cacheControl);
      ctx.type = 'image/x-icon';
      ctx.body = icon;
    }

    return true;
  };
};
