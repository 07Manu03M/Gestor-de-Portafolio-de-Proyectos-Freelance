const dbInstance = require("../config/db");

class ClienteRepo {
  static async agregar(cliente) {
    const db = await dbInstance.connect();
    await db.collection("cliente").insertOne(cliente);
  }

  static async ListarClientes() {
    const db = await dbInstance.connect();
    return await db.collection("cliente").find().toArray();
  }

  static async ActualizarCliente(cedula, nuevosDatos) {
    const db = await dbInstance.connect();
    await db.collection("cliente").updateOne(
      { cedula },
      { $set: nuevosDatos }
    );
  }

  static async EliminarCliente(cedula) {
    const db = await dbInstance.connect();
    await db.collection("cliente").deleteOne({ cedula });
  }

  static async existe(cedula) {
    const db = await dbInstance.connect();
    const cliente = await db.collection("cliente").findOne({ cedula });
    return !!cliente;
  }
}

module.exports = ClienteRepo;

// v