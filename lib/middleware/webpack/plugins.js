const Utils = require('../../utils');

/**
 * Removes files after Webpack compilation
 * Primarily used to remove superfluous JS files created during Sass compilation
 */
function RemoveFilesPlugin(options = {}) {
  this.files = options.files || [];
}

RemoveFilesPlugin.prototype.apply = function apply(compiler) {
  compiler.hooks.emit.tap(this.constructor.name, (compilation) => {
    /* eslint-disable-next-line no-param-reassign */
    compilation.assets = Utils.omit(compilation.assets, this.files);
  });
};

module.exports = {
  RemoveFilesPlugin,
};
