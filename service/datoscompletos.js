const dbInstance = require("../config/db");

class DatosRepo {
    static async agregarDatos(datos){
        const db = await dbInstance.connect();
        await db.collection("datos").insertOne(datos)
    }
}

module.exports = DatosRepo