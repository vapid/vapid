const BaseDirective = require('../../lib/directives/base');
const LinkDirective = require('../../lib/directives/link')(BaseDirective);

const vanilla = new LinkDirective();

describe('#input', () => {
  test('renders a url input by default', () => {
    expect(vanilla.input('test')).toMatch(/input type="url"/);
  });
});

describe('#preview', () => {
  test('does not escape HTML entities', () => {
    expect(vanilla.render('&<>"\'')).not.toEqual('&amp;&lt;&gt;&quot;&#39;');
  });
});

describe('#render', () => {
  test('does not unfurl links by default', () => {
    const url = 'http://example.com';
    expect(vanilla.render(url)).toEqual(url);
  });

  test('renders an oembed if unfurl=true', async () => {
    const url = 'https://www.youtube.com/watch?v=FtX8nswnUKU';
    const directive = new LinkDirective({ unfurl: true });
    const oembed = await directive.render(url);

    expect(oembed).toMatchSnapshot();
  });

  test('displays an <a> tag if an omebed is not found', async () => {
    const url = 'http://example.com';
    const directive = new LinkDirective({ unfurl: true });
    const failed = await directive.render(url);

    expect(failed).toMatchSnapshot();
  });
});
