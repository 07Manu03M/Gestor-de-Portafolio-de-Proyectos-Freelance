const dbInstance = require("../config/db");

class PropuestaRepo {
    static async agregar(propuesta) {
        const db = await dbInstance.connect();
        await db.collection("propuesta").insertOne(propuesta);
    }

    static async ListarPropuestas(){
        const db = await dbInstance.connect();
        return await db.collection("propuesta").find().toArray();
    }

    static async ActualizarPropuesta(idpropuesta, NuevosCambios){
        const db = await dbInstance.connect();
        await db.collection("propuesta").updateOne(
            { idpropuesta: parseInt(idpropuesta) },
            { $set: NuevosCambios}
        );
    }

    static async EliminarPropuesta(idpropuesta){
        const db = await dbInstance.connect();
        await db.collection("propuesta").deleteOne({ idpropuesta: parseInt(idpropuesta) });
    }

    static async existe(idpropuesta) {
        const db = await dbInstance.connect();
        const propuesta = await db.collection("propuesta").findOne({ idpropuesta: parseInt(idpropuesta) });
        return !!propuesta;
      }
}

module.exports = PropuestaRepo