const dbInstance = require("../config/db");

class FinanzaFactory {
  static crearFinanza({ id, tipo, descripcion, valor, fecha, idProyecto }) {
    return { id, tipo, descripcion, valor, fecha, idProyecto };
  }

  static async obtenerProyectos() {
    const db = await dbInstance.connect();
    const proyectos = await db.collection("proyectos").find().toArray();

    return proyectos.map(p => ({
      id: p._id,
      nombre: p.nombre,
      valorTotal: p.ingresosTotales || 0
    }));
  }
}

module.exports = FinanzaFactory;



