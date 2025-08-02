const inquirer = require("inquirer");
const GestionClientes = require("./comands/gestionClientes");
const GestionPropuestas = require("./comands/gestionsPropuestas");
const GestionProyectos = require("./comands/gestionProyectos");

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