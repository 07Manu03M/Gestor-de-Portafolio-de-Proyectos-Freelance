const dbInstance = require("../config/db");

class ContratoRepo {
    static async agregarcontraro(contrato) {
        const db = await dbInstance.connect();
        await db.collection("contratos").insertOne(contrato);
    }

    static async listarContratos() {
        const db = await dbInstance.connect();
        return await db.collection("contratos").find().toArray();
    }

    static async actualizarContrato(idcontrato, nuevosDatos) {
        const db = await dbInstance.connect();
        await db.collection("contratos").updateOne(
            { idcontrato },
            { $set: nuevosDatos }
        );
    }

    static async eliminarContrato(idcontrato) {
        const db = await dbInstance.connect();
        await db.collection("contratos").deleteOne({ idcontrato });
    }

    static async existe(idcontrato) {
        const db = await dbInstance.connect();
        const contrato = await db.collection("contratos").findOne({ idcontrato });
        return !!contrato;
    }

    static async listarContratosPorProyecto(idproyecto) {
        const db = await dbInstance.connect();
        return await db.collection("contratos").find({ idproyecto }).toArray();
    }

    static async buscarContratoPorId(idcontrato) {
        const db = await dbInstance.connect();
        return await db.collection("contratos").findOne({ idcontrato });
    }
}

module.exports = ContratoRepo;

