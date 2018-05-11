const Cache = require('../lib/cache');

const cache = new Cache();

describe('#clearPrefix', () => {
  test('clears keys with prefix only', () => {
    cache.put('a-1', 1);
    cache.put('a-2', 1);
    cache.put('b-1', 1);
    cache.clearPrefix('a-');

    expect(cache.keys()).toEqual(['b-1']);
  });
});
