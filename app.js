const inquirer = require("inquirer");
const GestionClientes = require("./comands/gestionClientes");

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
            "Salir"
          ]
        }
      ]);

      switch (opcion) {
        case "Gestión de Clientes":
          await GestionClientes.menu();
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