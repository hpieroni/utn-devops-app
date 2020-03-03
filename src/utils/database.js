const mongoose = require('mongoose');

class Database {
  /**
   * @see https://docs.mongodb.com/manual/reference/connection-string
   * @param {string} connectionUri mongo connection string
   * @param {Object} modelDefinitions map of mongoose model schemas
   */
  constructor(connectionUri, modelDefinitions = {}) {
    this.mongoose = mongoose;
    this.connectionUri = connectionUri;
    this.connection = null;
    this.loadModels(modelDefinitions);
  }

  loadModels(modelDefinitions) {
    Object.entries(modelDefinitions).forEach(([name, schema]) => this.mongoose.model(name, schema));
  }

  connect(cb) {
    this.mongoose.connect(
      this.connectionUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        promiseLibrary: global.Promise
      },
      cb
    );
    this.connection = this.mongoose.connection;

    this.connection.on('connected', () => console.info('[Database]: connection was successful'));
    this.connection.on('error', err => console.error(`[Database]: connection failed: ${err}`));
    this.connection.on('disconnected', () => console.info('[Database]: disconnected'));
  }

  close() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }

  get models() {
    return this.mongoose.models;
  }
}

module.exports = Database;
