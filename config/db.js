const { url } = require("inspector");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
  const client = await MongoClient.connect(uri); // se conecta
  return client.db("freelance"); // puedes llamarla "freelance"
}

module.exports = connectDB;
