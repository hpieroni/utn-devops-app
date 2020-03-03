const request = require('supertest');
const { ERRORS } = require('../src/utils/errors');
const createApp = require('../src/app');

describe('App', () => {
  const config = {};
  const app = createApp(config);

  test('should reply', async () => {
    return request(app)
      .get('/api')
      .expect(200, { message: 'server is up and running!' });
  });

  test('should send 404 when an invalid resource is requested', async () => {
    return request(app)
      .get('/invalid')
      .expect(404, ERRORS.NOT_FOUND);
  });
});
