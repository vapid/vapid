const BaseDirective = require('../../lib/directives/base');
const NumberDirective = require('../../lib/directives/number')(BaseDirective);

const vanilla = new NumberDirective();

describe('#input', () => {
  test('renders a number input by default', () => {
    expect(vanilla.input(0)).toMatch(/input type="number"/);
  });

  test('renders a range input if range=true', () => {
    const directive = new NumberDirective({ range: true });
    expect(directive.input(0)).toMatch(/input type="range"/);
  });
});

describe('#serialize', () => {
  test('converts strings to numbers', () => {
    expect(vanilla.serialize('10')).toEqual(10);
    expect(vanilla.serialize('3.14')).toEqual(3.14);
  });
});
