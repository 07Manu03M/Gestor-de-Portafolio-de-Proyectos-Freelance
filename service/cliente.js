const dbInstance = require("../config/db");

class ClienteRepo {
  static async agregar(cliente) {
    const db = await dbInstance.connect();
    await db.collection("clientes").insertOne(cliente);
  }

  static async ListarClientes() {
    const db = await dbInstance.connect();
    return await db.collection("clientes").find().toArray();
  }

  static async ActualizarCliente(cedula, nuevosDatos) {
    const db = await dbInstance.connect();
    await db.collection("clientes").updateOne(
      { cedula: cedula }, // <- Ojo aquí, depende del tipo
      { $set: nuevosDatos }
    );
  }

  static async EliminarCliente(cedula) {
    const db = await dbInstance.connect();
    await db.collection("clientes").deleteOne({ cedula: cedula });
  }

  static async existe(cedula) {
    const db = await dbInstance.connect();
    const cliente = await db.collection("clientes").findOne({ cedula: cedula });
    return !!cliente;
  }
}

module.exports = ClienteRepo;
