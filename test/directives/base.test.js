const BaseDirective = require('../../lib/directives/base');

const vanilla = new BaseDirective();

describe('.constructor', () => {
  test('ignores non-allowed params', () => {
    const directive = new BaseDirective({ junk: true });
    expect(directive.attrs).not.toHaveProperty('junk');
    expect(directive.options).not.toHaveProperty('junk');
  });

  test('sets required=true by default', () => {
    expect(vanilla.attrs.required).toBeTruthy();
  });

  test('allows defaults to be overridden', () => {
    const directive = new BaseDirective({ required: false });
    expect(directive.attrs.required).toBeFalsy();
  });

  test('accepts a default value', () => {
    const directive = new BaseDirective({ default: 'testing' });
    expect(directive.render()).toEqual('testing');
    expect(directive.input()).toMatch(/value="testing"/);
  });
});

describe('#htmlAttributes', () => {
  test('turns attrs object into HTML-style attributes', () => {
    const directive = new BaseDirective({ placeholder: 'test' });
    expect(directive.htmlAttrs).toMatch(/placeholder="test"/);
  });
});

describe('#input', () => {
  test('renders a text input by default', () => {
    expect(vanilla.input('test')).toMatch(/input type="text"/);
  });
});

describe('#render', () => {
  test('converts "&", "<", ">", \'"\', and "\'" to HTML entities', () => {
    expect(vanilla.render('&<>"\'')).toEqual('&amp;&lt;&gt;&quot;&#39;');
  });
});

describe('#preview', () => {
  test('converts "&", "<", ">", \'"\', and "\'" to HTML entities', () => {
    expect(vanilla.preview('&<>"\'')).toEqual('&amp;&lt;&gt;&quot;&#39;');
  });
});
