const inquirer = require("inquirer");
const ClienteRepo = require("../service/cliente");
const Cliente = require("../models/client");

class GestionClientes {
  static async pedirDatosCliente() {
    return await inquirer.prompt([
      { type: "input", name: "cedula", message: "Ingresa la cédula:" },
      { type: "input", name: "nombre", message: "Ingresa el nombre:" },
      { type: "input", name: "apellido", message: "Ingresa el apellido:" },
      { type: "input", name: "correo", message: "Ingresa el correo:" },
      { type: "input", name: "telefono", message: "Ingresa el teléfono:" },
      { type: "input", name: "empresa", message: "Ingresa la empresa (si aplica):" }
    ]);
  }

  static async menu() {
    let salir = false;

    while (!salir) {
      const { opcion } = await inquirer.prompt([
        {
          type: "list",
          name: "opcion",
          message: "Selecciona una opción",
          choices: [
            "Agregar un cliente",
            "Ver Lista de Clientes",
            "Actualizar Cliente",
            "Eliminar Cliente",
            "Salir"
          ]
        }
      ]);

      switch (opcion) {
        case "Agregar un cliente":
          try {
            const data = await this.pedirDatosCliente();
            const cliente = new Cliente(data);
            const existe = await ClienteRepo.existe(cliente.cedula);

            if (existe) {
              console.log("Ya existe un cliente con esa cédula.");
              break;
            }

            await ClienteRepo.agregar(cliente);
            console.log("Cliente agregado con éxito");
          } catch (error) {
            console.log("Error:", error.message);
          }
          break;

        case "Ver Lista de Clientes":
          const lista = await ClienteRepo.ListarClientes();
          console.log(lista);
          await inquirer.prompt([{ type: "input", name: "continuar", message: "Presiona ENTER para volver..." }]);
          break;

        case "Actualizar Cliente":
          const { cedula } = await inquirer.prompt([{ type: "input", name: "cedula", message: "Cédula a actualizar:" }]);
          const existeActualizar = await ClienteRepo.existe(cedula);

          if (!existeActualizar) {
            console.log("No existe ningún cliente con esa cédula.");
            break;
          }

          const nuevosDatos = await this.pedirDatosCliente();
          const clienteActualizado = new Cliente(nuevosDatos);
          await ClienteRepo.ActualizarCliente(cedula, clienteActualizado);
          console.log("Cliente actualizado");
          break;

        case "Eliminar Cliente":
          const { cedulaEliminar } = await inquirer.prompt([{ type: "input", name: "cedulaEliminar", message: "Cédula a eliminar:" }]);
          const existeEliminar = await ClienteRepo.existe(cedulaEliminar);

          if (!existeEliminar) {
            console.log("No existe ningún cliente con esa cédula.");
            break;
          }

          await ClienteRepo.EliminarCliente(cedulaEliminar);
          console.log("Cliente eliminado");
          break;

        case "Salir":
          salir = true;
          console.log("Bye :3");
          break;
      }
    }
  }
}

module.exports = GestionClientes;
