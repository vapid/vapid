const middleware = require('../lib/middleware');
const supertest = require('supertest');
const Koa = require('koa');

let app;
let server;
let request;

beforeEach((done) => {
  app = new Koa();
  server = app.listen(done);
  request = supertest.agent(server);
});

afterEach((done) => {
  server.close(done);
});

/**
 * ASSETS
 */
describe('assets', () => {
  test.skip();
});

/**
 * FAVICON
 */
describe('favicon', () => {
  test.skip();
});

/**
 * LOGS
 */
describe('logs', () => {
  test.skip();
});

/**
 * PRIVATE FILES
 */
describe('privateFiles', () => {
  it('passes normal paths', (done) => {
    app.use(middleware.privateFiles)
      .use((ctx) => {
        ctx.body = '';
      });

    request.get('/test')
      .expect(200, done);
  });

  it('404 when paths starts with an underscore', (done) => {
    app
      .use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          expect(err.output.statusCode).toEqual(404);
          expect(err.output.payload.message).toMatchSnapshot();
        }
      })
      .use(middleware.privateFiles);

    request.get('/_test')
      .end(done);
  });

  it('404 when paths starts with a period', (done) => {
    app
      .use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          expect(err.output.statusCode).toEqual(404);
          expect(err.output.payload.message).toMatchSnapshot();
        }
      })
      .use(middleware.privateFiles);

    request.get('/.test')
      .end(done);
  });
});

/**
 * SECURITY
 * Reduntant koa-helmet test, but included in case this middleware
 * is updated down the road.
 */
describe('security', () => {
  it('uses the default helmet config', (done) => {
    app.use(middleware.security);

    request.get('/')
      .expect('X-DNS-Prefetch-Control', 'off')
      .expect('X-Frame-Options', 'SAMEORIGIN')
      .expect('Strict-Transport-Security', 'max-age=15552000; includeSubDomains')
      .expect('X-Download-Options', 'noopen')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('X-XSS-Protection', '1; mode=block')
      .end(done);
  });
});

/**
 * SESSION
 */
describe('session', () => {
  it('sets the vapid:sess as the key', (done) => {
    app.keys = ['secret'];
    app.use(middleware.session(app))
      .use((ctx) => {
        ctx.session.test = 'test';
      });

    request.get('/')
      .expect('Set-Cookie', /vapid:sess/)
      .end(done);
  });
});

/**
 * WEBPACK
 */
describe('webpack', () => {
  test.skip();
});
