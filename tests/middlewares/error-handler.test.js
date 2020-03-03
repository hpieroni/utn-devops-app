const { ApiError, ERRORS } = require('../../src/utils/errors');
const errorHandler = require('../../src/middlewares/error-handler');

describe('Error handler middleware', () => {
  const req = {};
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('on ApiError errors', () => {
    test('should format its data as json', () => {
      const error = new ApiError(ERRORS.NOT_FOUND);

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(ERRORS.NOT_FOUND);
    });
  });

  describe('on unexpected errors', () => {
    test('should return a 500 error with default message and attach original error', () => {
      const error = new Error('original error');

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        ...ERRORS.UNEXPECTED,
        details: {
          message: 'original error',
          originalError: error
        }
      });
    });
  });
});
