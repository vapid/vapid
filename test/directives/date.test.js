const BaseDirective = require('../../lib/directives/base');
const DateDirective = require('../../lib/directives/date')(BaseDirective);

const vanilla = new DateDirective();
const date = '2015-10-21T00:04:29.000Z';

describe('#input', () => {
  test('renders a date input by default', () => {
    expect(vanilla.input('test')).toMatch(/input type="date"/);
  });

  test('renders a datetime-local input if time=true', () => {
    const directive = new DateDirective({ time: true });
    expect(directive.input('test')).toMatch(/input type="datetime-local"/);
  });
});

describe('#render', () => {
  test('default date format', () => {
    expect(vanilla.render(date)).toEqual('October 21, 2015');
  });

  test('override date format', () => {
    const directive = new DateDirective({ format: '%Y-%m-%d' });
    expect(directive.render(date)).toEqual('2015-10-21');
  });
});
