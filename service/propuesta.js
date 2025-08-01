const dbInstance = require("../config/db");

class PropuestaRepo {
    static async agregar(propuesta) {
        const db = await dbInstance.connect();
        await db.collection("propuesta").insertOne(propuesta);
    }

    static async existe(idpropuesta) {
        const db = await dbInstance.connect();
        const propuesta = await db.collection("propuesta").findOne({ idpropuesta });
        return !!propuesta;
      }
}

module.exports = PropuestaRepo