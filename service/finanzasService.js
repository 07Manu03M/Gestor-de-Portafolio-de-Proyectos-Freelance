const dbInstance = require("../config/db");
const { ObjectId } = require("mongodb");

class FinanzasService {
  static async registrarIngreso({ proyectoId, descripcion, valor, fecha }) {
    const db = await dbInstance.connect();
    const session = db.client.startSession();

    try {
      await session.withTransaction(async () => {
        await db.collection("ingresos").insertOne(
          {
            proyectoId: new ObjectId(proyectoId),
            descripcion,
            valor,
            fecha
          },
          { session }
        );

        await db.collection("proyectos").updateOne(
          { _id: new ObjectId(proyectoId) },
          { $inc: { ingresosTotales: valor } },
          { session }
        );
      });

      console.log("✅ Ingreso registrado con transacción.");
    } catch (err) {
      console.error("❌ Error al registrar ingreso:", err.message);
    } finally {
      await session.endSession();
    }
  }

  static async registrarEgreso({ proyectoId, descripcion, valor, fecha }) {
    const db = await dbInstance.connect();
    const session = db.client.startSession();

    try {
      await session.withTransaction(async () => {
        await db.collection("egresos").insertOne(
          {
            proyectoId: new ObjectId(proyectoId),
            descripcion,
            valor,
            fecha
          },
          { session }
        );

        await db.collection("proyectos").updateOne(
          { _id: new ObjectId(proyectoId) },
          { $inc: { ingresosTotales: -valor } },
          { session }
        );
      });

      console.log("✅ Egreso registrado con transacción.");
    } catch (err) {
      console.error("❌ Error al registrar egreso:", err.message);
    } finally {
      await session.endSession();
    }
  }

  static async calcularBalanceGlobal() {
    try {
      const db = await dbInstance.connect();
      const proyectos = await db.collection("proyectos").find().toArray();

      const resumen = [];
      let totalGlobal = 0;

      for (const proyecto of proyectos) {
        const id = proyecto._id;

        const ingresos = await db.collection("ingresos").aggregate([
          { $match: { proyectoId: id } },
          { $group: { _id: null, total: { $sum: "$valor" } } }
        ]).toArray();

        const egresos = await db.collection("egresos").aggregate([
          { $match: { proyectoId: id } },
          { $group: { _id: null, total: { $sum: "$valor" } } }
        ]).toArray();

        const ingresosTotal = ingresos[0]?.total || 0;
        const egresosTotal = egresos[0]?.total || 0;
        const balance = ingresosTotal - egresosTotal;

        resumen.push({
          idProyecto: id.toString(),
          ingresos: ingresosTotal,
          egresos: egresosTotal,
          balance
        });

        totalGlobal += balance;
      }

      return { resumen, totalGlobal };
    } catch (err) {
      console.log("❌ Error al calcular balance:", err.message);
      return { resumen: [], totalGlobal: 0 };
    }
  }
}

module.exports = FinanzasService;












