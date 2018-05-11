const directives = require('./directives');
const Utils = require('./utils');

/**
 * Renders forms, both for the dashboard and user-facing contact forms
 *
 */
class Form {
  /**
   * @static
   *
   * Render an individual form field/input
   *
   * @param {string} name
   * @param {Object} params
   * @param {string} value
   * @param {string} [error]
   * @return {string} rendered HTML
   */
  static field(name, label, params, value, error) {
    const directive = directives.find(params);
    const requiredClass = directive.attrs.required ? 'required ' : '';
    const errorClass = error ? 'error ' : '';

    return `
      <div class="${requiredClass}${errorClass}field">
        <label>${params.label || Utils.startCase(label)}</label>
        ${directive.input(name, value)}
        <small>${error || params.help || ''}</small>
      </div>`;
  }
}

module.exports = Form;
