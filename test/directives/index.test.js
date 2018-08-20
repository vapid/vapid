const directives = require('../../lib/directives');

describe('.find', () => {
  test('fallback to TextDirective', () => {
    const directive = directives.find();
    expect(directive.constructor.name).toEqual('TextDirective');
  });
});
