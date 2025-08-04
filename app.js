const inquirer = require("inquirer");
const GestionClientes = require("./comands/gestionClientes");
const GestionPropuestas = require("./comands/gestionsPropuestas");
const GestionProyectos = require("./comands/gestionProyectos");
const GestionContratos = require("./comands/gestionContratos");
const GestionAvances = require("./comands/gestionAvances");
const GestionFinanzas = require('./comands/gestionFinanzas');



class App {
  static async main() {
    let salir = false;

    while (!salir) {
      const { opcion } = await inquirer.prompt([
        {
          type: "list",
          name: "opcion",
          message: "Menú Principal",
          choices: [
            "Gestión de Clientes",
            "Gestion de Propuestas",
            "Gestion de Proyectos",
            "Gestion de Contratos",
            "Gestion de Avances",
            "Gestion financiera",
            "Salir"
          ]
        }
      ]);

      switch (opcion) {
        case "Gestión de Clientes":
          await GestionClientes.menu();
          break;

        case "Gestion de Propuestas":
          await GestionPropuestas.menu();
          break;

        case "Gestion de Proyectos":
          await GestionProyectos.menu();
          break;

        case "Gestion de Contratos":
          await GestionContratos.menu();
          break;

        case "Gestion de Avances":
          await GestionAvances.menu();
          break;

        case "Gestion financiera":
          await GestionFinanzas.menu();
          break;

        case "Salir":
          salir = true;
          console.log("Chao, nos vidrios 👋");
          process.exit(0);
      }
    }
  }
}

App.main();
// v