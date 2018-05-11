const BaseDirective = require('../../lib/directives/base');
const TextDirective = require('../../lib/directives/text')(BaseDirective);

describe('#input', () => {
  test('renders long=true as a textarea', () => {
    const directive = new TextDirective({ long: true });
    expect(directive.input('test')).toMatch(/textarea/);
  });

  test('sets the maxlength attribute', () => {
    const directive = new TextDirective({ maxlength: 115 });
    expect(directive.input('test')).toMatch(/maxlength="115"/);
  });
});
