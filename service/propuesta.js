const dbInstance = require("../config/db");

class PropuestaRepo {
    static async listar() {
        const db = await dbInstance.connect();
        return await db.collection("propuesta").find().toArray();
    }

    // Si aún no los tienes puedes agregar estos:
    static async agregar(propuesta) {
        const db = await dbInstance.connect();
        await db.collection("propuesta").insertOne(propuesta);
    }

    static async ActualizarPropuesta(idpropuesta, nuevosDatos) {
        const db = await dbInstance.connect();
        await db.collection("propuesta").updateOne(
            { idpropuesta },
            { $set: nuevosDatos }
        );
    }

    static async EliminarPropuesta(idpropuesta) {
        const db = await dbInstance.connect();
        await db.collection("propuesta").deleteOne({ idpropuesta });
    }

    static async obtenerPorId(idpropuesta) {
        const db = await dbInstance.connect();
        return await db.collection("propuesta").findOne({ idpropuesta });
    }

    static async existe(idpropuesta) {
    const db = await dbInstance.connect();
    const resultado = await db.collection("propuesta").findOne({ idpropuesta });
    return resultado !== null;
}
}

module.exports = PropuestaRepo;
