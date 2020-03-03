const { objectId, commaSeparatedValues } = require('../../src/utils/joi-custom-schemas');

describe('Joi extension schemas', () => {
  describe('ojectId', () => {
    test('should return an error if the value is not an ObjectId', () => {
      const { error } = objectId.validate('invalid');
      expect(error.message).toBe('must be an ObjectId');
    });

    test('should not return an error if the value is an ObjectId', () => {
      const { error } = objectId.validate('507f1f77bcf86cd799439011');
      expect(error).toBeUndefined();
    });
  });

  describe('commaSeparatedValues', () => {
    test('should return an error if it is not a comma separated values string', () => {
      const { error } = commaSeparatedValues.validate('foo,');
      expect(error.message).toBe('must be a string of comma separated values whitout whitespaces');
    });

    test('should not return an error if is a comma separated values string', () => {
      const { error } = commaSeparatedValues.validate('foo,bar');
      expect(error).toBeUndefined();
    });
  });
});
