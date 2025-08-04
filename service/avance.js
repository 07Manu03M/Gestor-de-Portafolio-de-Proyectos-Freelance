const dbInstance = require("../config/db");

class AvanceRepo {
    static async agregar(avance) {
        const db = await dbInstance.connect();
        await db.collection("avances").insertOne(avance);
    }

    static async listar() {
        const db = await dbInstance.connect();
        return await db.collection("avances").find().toArray();
    }

    static async actualizar(idAvance, nuevosDatos) {
        const db = await dbInstance.connect();
        await db.collection("avances").updateOne(
            { idAvance },
            { $set: nuevosDatos }
        );
    }

    static async eliminar(idAvance) {
        const db = await dbInstance.connect();
        await db.collection("avances").deleteOne({ idAvance });
    }

    static async existe(idAvance) {
        const db = await dbInstance.connect();
        const existe = await db.collection("avances").findOne({ idAvance });
        return !!existe;
    }
    static async obtenerPorId(idAvance) {
        const db = await dbInstance.connect();
        return await db.collection("avances").findOne({ idAvance });
    }
}

module.exports = AvanceRepo;
