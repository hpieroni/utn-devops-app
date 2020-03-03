const request = require('supertest');
const createApp = require('../../src/app');
const { ERRORS } = require('../../src/utils/errors');

describe('/api/v1/users', () => {
  const mockDatabase = {
    models: {
      User: {
        create: jest.fn()
      }
    }
  };
  const { User } = mockDatabase.models;
  const config = { database: mockDatabase };
  const app = createApp(config);

  describe('POST /', () => {
    test('should send 400 if payload is invalid', async () => {
      return request(app)
        .post('/api/v1/users')
        .send({ name: 'john' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_BODY,
          details: {
            avatar: 'is required'
          }
        });
    });
  });

  test('should send the new created user if payload is valid', async () => {
    const body = { name: 'john', avatar: 'http://john.com/avatar' };
    const newUser = { _id: '1', ...body };

    User.create.mockResolvedValueOnce({ toObject: () => newUser });

    const res = await request(app)
      .post('/api/v1/users')
      .send(body)
      .set('Accept', 'application/json');

    expect(User.create).toHaveBeenCalledWith(body);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(newUser);
  });
});
