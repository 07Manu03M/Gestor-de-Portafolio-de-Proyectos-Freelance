const dbInstance = require("../config/db");

class ProyectoRepo{
    static async agregarproyecto(proyecto){
        const db = await dbInstance.connect();
        await db.collection("proyectos").insertOne(proyecto);
    }

    static async verproyectos(){
        const db = await dbInstance.connect();
        return await db.collection("proyectos").find().toArray();
    }

    static async ActualizarProyecto(idproyecto, nuevosDatos){
            const db = await dbInstance.connect();
            await db.collection("proyectos").updateOne(
                { idproyecto },
                { $set: nuevosDatos}
            );
        }

    static async EliminarProyecto(idproyecto){
        const db = await dbInstance.connect();
        await db.collection("proyectos").deleteOne({ idproyecto });
    }

    static async existe(idproyecto) {
        const db = await dbInstance.connect();
        const proyecto = await db.collection("proyectos").findOne({ idproyecto });
        return !!proyecto;
      }
}

module.exports = ProyectoRepo