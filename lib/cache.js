const memory = require('memory-cache');
const Utils = require('./utils');

/**
 * An in-memory cache
 *
 * @extends { memory.Cache }
 */
class Cache extends memory.Cache {
  /**
   * Selectively clear items from the cache by key prefix
   *
   * @param {string} prefix
   */
  clearPrefix(prefix) {
    // Note: this isn't used anymore, but may come in handy down the road.
    this.keys().forEach((key) => {
      if (Utils.startsWith(key, prefix)) {
        this.del(key);
      }
    });
  }
}

module.exports = Cache;
