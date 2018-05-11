const BaseDirective = require('../../lib/directives/base');
const ChoiceDirective = require('../../lib/directives/choice')(BaseDirective);

const vanilla = new ChoiceDirective();

describe('.constructor', () => {
  test('parses options into an array', () => {
    const directive = new ChoiceDirective({ options: 'Yes, No, Maybe' });
    expect(directive.possibilities).toEqual(expect.arrayContaining(['Yes', 'No', 'Maybe']));
  });

  test('sets require=false if there\'s less than 2 options', () => {
    const directive = new ChoiceDirective({ options: 'Big, Small' });

    expect(directive.attrs.required).toBeTruthy();
    expect(vanilla.attrs.required).toBeFalsy();
  });
});

describe('#input', () => {
  test('renders a checkbox if there are < 2 options', () => {
    expect(vanilla.input('test')).toMatch(/type="checkbox"/);
    expect(vanilla.input('test')).not.toMatch(/toggle/);
  });

  test('allows toggle input if there are <= 1 options', () => {
    const good = new ChoiceDirective({ input: 'toggle' });
    expect(good.input('test')).toMatch(/type="checkbox"/);
    expect(good.input('test')).toMatch(/toggle/);

    const bad = new ChoiceDirective({ input: 'toggle', options: 'Yes, No' });
    expect(bad.input('test')).not.toMatch(/toggle/);
  });

  test('renders a radio if there are <= 3 options or if input=radio', () => {
    const good = new ChoiceDirective({ options: 'Yes, No, Maybe' });
    expect(good.input('test')).toMatch(/radio/);

    const alsoGood = new ChoiceDirective({ input: 'radio', options: 'Yes, No, Maybe, Other' });
    expect(alsoGood.input('test')).toMatch(/radio/);
  });

  test('renders a dropdown if there are > 3 options or if input=dropdown', () => {
    const good = new ChoiceDirective({ options: 'Yes, No, Maybe, Other' });
    expect(good.input('test')).toMatch(/<select/);
    expect(good.input('test')).toMatch(/dropdown/);

    const alsoGood = new ChoiceDirective({ input: 'dropdown', options: 'Yes, No' });
    expect(alsoGood.input('test')).toMatch(/dropdown/);
  });

  test('allows multi-select dropdown', () => {
    const multiple = new ChoiceDirective({ options: 'Yes, No, Maybe, Other', multiple: true });
    expect(multiple.input('test')).toMatch(/dropdown/);
    expect(multiple.input('test')).toMatch(/multiple/);

    const notMultiple = new ChoiceDirective({ options: 'Yes, No, Maybe, Other' });
    expect(notMultiple.input('test')).toMatch(/dropdown/);
    expect(notMultiple.input('test')).not.toMatch(/multiple/);
  });
});

describe('#render', () => {
  test('joins array with spaced commas', () => {
    expect(vanilla.render(['a', 'b', 'c'])).toEqual('a, b, c');
  });
});
