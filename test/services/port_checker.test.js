const net = require('net');
const PortChecker = require('../../lib/services/port_checker');

describe('#perform', () => {
  test('sees if port is already in use', async () => {
    let taken;
    const port = 5150;
    const server = new net.Server();

    // No server running
    taken = await new PortChecker(port).perform();
    expect(taken).toBeFalsy();

    // Server running
    server.listen(port, async () => {
      taken = await new PortChecker(port).perform();
      expect(taken).toBeTruthy();
      server.close();
    });
  });
});
