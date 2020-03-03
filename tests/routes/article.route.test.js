const request = require('supertest');
const createApp = require('../../src/app');
const { ERRORS } = require('../../src/utils/errors');

describe('/api/v1/articles', () => {
  const mockDatabase = {
    models: {
      Article: {
        create: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
      }
    }
  };
  const { Article } = mockDatabase.models;
  const article = {
    userId: '5c0a7922c9d89830f4911426',
    title: 'Title',
    text: 'random text',
    tags: ['cars', 'technology']
  };
  const newArticle = {
    _id: '5e39b7f53afc525306470a21',
    ...article
  };
  const config = { database: mockDatabase };
  const app = createApp(config);

  describe('POST /', () => {
    test('should send an error if payload is invalid', async () => {
      return request(app)
        .post('/api/v1/articles')
        .send({ tags: [1] })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_BODY,
          details: {
            userId: 'is required',
            title: 'is required',
            text: 'is required',
            tags: ['must be a string']
          }
        });
    });

    test('should send the new created article if payload is valid', async () => {
      Article.create.mockResolvedValueOnce({ toObject: () => newArticle });

      const res = await request(app)
        .post('/api/v1/articles')
        .send(article)
        .set('Accept', 'application/json');

      expect(Article.create).toHaveBeenCalledWith(article);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(newArticle);
    });
  });

  describe('PUT /:id', () => {
    test('should send an error if params id is not an ObjectId', async () => {
      return request(app)
        .put('/api/v1/articles/invalidObjectId')
        .send(article)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_PARAMS,
          details: {
            id: 'must be an ObjectId'
          }
        });
    });

    test('should send an error if payload is invalid', async () => {
      return request(app)
        .put('/api/v1/articles/5e39b81e3afc525306470a23')
        .send({ tags: [1] })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_BODY,
          details: {
            userId: 'is required',
            title: 'is required',
            text: 'is required',
            tags: ['must be a string']
          }
        });
    });

    test('should send 404 error if article does not exist', async () => {
      Article.findByIdAndUpdate.mockResolvedValueOnce(null);

      const res = await request(app)
        .put('/api/v1/articles/5e39b81e3afc525306470a23')
        .send(article)
        .set('Accept', 'application/json');

      expect(res.status).toBe(404);
      expect(res.body).toEqual(ERRORS.NOT_FOUND);
    });

    test('should return updated article', async () => {
      Article.findByIdAndUpdate.mockResolvedValueOnce({ toObject: () => newArticle });

      const id = '5e39b81e3afc525306470a23';
      const res = await request(app)
        .put(`/api/v1/articles/${id}`)
        .send(article)
        .set('Accept', 'application/json');

      expect(Article.findByIdAndUpdate).toHaveBeenCalledWith(id, article, { new: true });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(newArticle);
    });
  });

  describe('DELETE /:id', () => {
    test('should send an error if params id is not an ObjectId', async () => {
      return request(app)
        .delete('/api/v1/articles/invalidObjectId')
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_PARAMS,
          details: {
            id: 'must be an ObjectId'
          }
        });
    });

    test('should send 404 error if article does not exist', async () => {
      Article.findByIdAndDelete.mockResolvedValueOnce(null);

      const id = '5e39b81e3afc525306470a23';
      const res = await request(app).delete(`/api/v1/articles/${id}`);

      expect(Article.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(res.status).toBe(404);
      expect(res.body).toEqual(ERRORS.NOT_FOUND);
    });

    test('should confirm deletion with 204 and no content', async () => {
      Article.findByIdAndDelete.mockResolvedValueOnce(article);

      const id = '5e39b81e3afc525306470a23';
      const res = await request(app).delete(`/api/v1/articles/${id}`);

      expect(Article.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });
  });

  describe('GET /', () => {
    test('should return all articles that contains the given tags (1 or more)', async () => {
      Article.find.mockResolvedValueOnce([article]);

      const res = await request(app).get(`/api/v1/articles?tags=foo,cars`);

      expect(Article.find).toHaveBeenCalledWith(
        { tags: { $elemMatch: { $in: ['foo', 'cars'] } } },
        '-__v'
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual([article]);
    });

    test('should require tags querystring variable', async () => {
      return request(app)
        .get('/api/v1/articles')
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_QUERY,
          details: {
            tags: 'is required'
          }
        });
    });

    test('should send an error if tag querystring variable is invalid', async () => {
      return request(app)
        .get('/api/v1/articles?tags=,foo,')
        .expect(400, {
          ...ERRORS.INVALID_REQUEST_QUERY,
          details: {
            tags: 'must be a string of comma separated values whitout whitespaces'
          }
        });
    });
  });
});
