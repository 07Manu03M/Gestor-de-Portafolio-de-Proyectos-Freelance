const inquirer = require("inquirer");
const FinanzasService = require("../service/finanzasService");
const FinanzaFactory = require("../factories/FinanzaFactory");

class GestionFinanzas {
  static async seleccionarProyecto() {
    const proyectos = await FinanzaFactory.obtenerProyectos();
    if (proyectos.length === 0) throw new Error("No hay proyectos registrados.");

    const { idProyecto } = await inquirer.prompt([
      {
        type: "list",
        name: "idProyecto",
        message: "Selecciona el proyecto:",
        choices: proyectos.map(p => ({
          name: `${p.nombre} (Valor Total: $${p.valorTotal})`,
          value: p.id
        }))
      }
    ]);
    return idProyecto;
  }

  static async registrarIngreso() {
    try {
      const idProyecto = await this.seleccionarProyecto();
      const { descripcion, valor, fecha } = await inquirer.prompt([
        { type: "input", name: "descripcion", message: "Descripción del ingreso:" },
        { type: "number", name: "valor", message: "Valor del ingreso:" },
        { type: "input", name: "fecha", message: "Fecha (YYYY-MM-DD):" }
      ]);

      const finanza = FinanzaFactory.crearFinanza({
        id: Date.now().toString(),
        tipo: "ingreso",
        descripcion,
        valor,
        fecha,
        idProyecto
      });

      await FinanzasService.registrarIngreso({
        proyectoId: idProyecto,
        descripcion,
        valor,
        fecha
      });

      console.log("✅ Ingreso registrado y agregado al total.");
    } catch (e) {
      console.log("❌ Error:", e.message);
    }
  }

  static async registrarEgreso() {
    try {
      const idProyecto = await this.seleccionarProyecto();
      const { descripcion, valor, fecha } = await inquirer.prompt([
        { type: "input", name: "descripcion", message: "Motivo del egreso:" },
        { type: "number", name: "valor", message: "Valor del egreso:" },
        { type: "input", name: "fecha", message: "Fecha (YYYY-MM-DD):" }
      ]);

      const finanza = FinanzaFactory.crearFinanza({
        id: Date.now().toString(),
        tipo: "egreso",
        descripcion,
        valor,
        fecha,
        idProyecto
      });

      await FinanzasService.registrarEgreso({
        proyectoId: idProyecto,
        descripcion,
        valor,
        fecha
      });

      console.log("✅ Egreso registrado y descontado del total.");
    } catch (e) {
      console.log("❌ Error:", e.message);
    }
  }

  static async mostrarBalanceGlobal() {
    const resumen = await FinanzasService.calcularBalanceGlobal();

    console.log("📊 Balance por proyecto:");
    resumen.resumen.forEach(r => {
      console.log(`🔹 Proyecto ID: ${r.idProyecto}`);
      console.log(`   ➕ Ingresos: $${r.ingresos}`);
      console.log(`   ➖ Egresos: $${r.egresos}`);
      console.log(`   💰 Balance: $${r.balance}`);
    });

    console.log(`\n💼 Balance global total: $${resumen.totalGlobal}`);
  }

  static async menu() {
    let salir = false;

    while (!salir) {
      const { opcion } = await inquirer.prompt([
        {
          type: "list",
          name: "opcion",
          message: "📊 Gestión Financiera",
          choices: [
            { name: "Registrar ingreso", value: "ingreso" },
            { name: "Registrar egreso", value: "egreso" },
            { name: "Ver balance global", value: "balance" },
            { name: "Volver", value: "salir" }
          ]
        }
      ]);

      switch (opcion) {
        case "ingreso":
          await this.registrarIngreso();
          break;
        case "egreso":
          await this.registrarEgreso();
          break;
        case "balance":
          await this.mostrarBalanceGlobal();
          break;
        case "salir":
          salir = true;
          console.log("👋 Adiós finanzas");
          break;
      }
    }
  }
}

module.exports = GestionFinanzas;




