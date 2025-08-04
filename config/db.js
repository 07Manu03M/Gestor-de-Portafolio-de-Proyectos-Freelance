  const { MongoClient } = require("mongodb");

  class Database {
    static instance;

    constructor() {
      this.uri = "mongodb://localhost:27017";
      this.dbname = "freelance";
      this.client = new MongoClient(this.uri);
    }

    async connect() {
      if (!Database.instance) {
        await this.client.connect();
        Database.instance = this.client.db(this.dbname);
      }
      return Database.instance;
    }

    getClient() {
      return this.client;
    }
  }

  module.exports = new Database();





