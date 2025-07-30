const connectDB = require("../config/db");

class AgregarCliente {
  static async agregar(cliente) {
    const db = await connectDB();
    await db.collection("cliente").insertOne(cliente);
  }

  static async ListarClientes() {
    const db = await connectDB();
    return await db.collection("cliente").find().toArray();
  }

  static async ActualizarCliente(cedula, nuevosDatos) {
    const db = await connectDB();
    await db.collection("cliente").updateOne(
      { cedula },
      { $set: nuevosDatos }
    );
  }

  static async EliminarCliente(cedula) {
    const db = await connectDB();
    await db.collection("cliente").deleteOne({ cedula });
  }

  static async existe(cedula) {
    const db = await connectDB();
    const cliente = await db.collection("cliente").findOne({ cedula });
    return !!cliente;
  }
}

module.exports = AgregarCliente;
// v