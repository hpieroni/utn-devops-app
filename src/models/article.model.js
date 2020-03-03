const { Schema } = require('mongoose');

module.exports = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    tags: {
      type: [String]
    }
  },
  { toObject: { versionKey: false } }
);
