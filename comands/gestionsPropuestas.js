const inquirer = require("inquirer");
const PropuestaRepo = require("../service/propuesta");
const PropuestaFactory = require("../factories/PropuestaFactory");
const ClienteRepo = require("../service/cliente");

class GestionPropuestas {
    static async pedirDatosPropuesta() {
        const clientes = await ClienteRepo.ListarClientes();

        if (clientes.length === 0) {
            console.log("❌ No hay clientes registrados. Primero crea uno.");
            return null;
        }

        const opcionesClientes = clientes.map(c => ({
            name: `${c.cedula} - ${c.nombre}`,
            value: c.cedula
        }));

        const respuestas = await inquirer.prompt([
            { type: "list", name: "cedulaCliente", message: "Selecciona el cliente:", choices: opcionesClientes },
            { type: "input", name: "idpropuesta", message: "ID de la propuesta:" },
            { type: "input", name: "nombre", message: "Nombre de la propuesta:"},
            { type: "input", name: "descripcion", message: "Descripción de la propuesta:" },
            { type: "input", name: "precio", message: "Precio de la propuesta:" },
            { type: "input", name: "plazoDias", message: "Plazo en días:" },
            {
                type: "list",
                name: "estado",
                message: "Estado de la propuesta:",
                choices: ["pendiente", "aceptada", "rechazada"]
            }
        ]);

        return respuestas;
    }

    static async menu() {
        let salir = false;

        while (!salir) {
            const { opcion } = await inquirer.prompt([
                {
                    type: "list",
                    name: "opcion",
                    message: "Selecciona una opcion",
                    choices: [
                        "Agregar Una Propuesta",
                        "Ver Lista Propuestas",
                        "Actualizar Propuesta",
                        "Eliminar Propuesta",
                        "Retroceder"
                    ]
                }
            ]);

            switch (opcion) {
                case "Agregar Una Propuesta":
                    try {
                        const data = await this.pedirDatosPropuesta();
                        if (!data) break;

                        data.idpropuesta = parseInt(data.idpropuesta);
                        data.precio = parseFloat(data.precio);
                        data.plazoDias = parseInt(data.plazoDias);
                        data.estado = data.estado.toLowerCase();
                        data.fechaCreacion = new Date();

                        const propuesta = PropuestaFactory.crearPropuesta(data);

                        const existe = await PropuestaRepo.existe(propuesta.idpropuesta);
                        if (existe) {
                            console.log("Ya existe una propuesta con ese ID.");
                            break;
                        }

                        await PropuestaRepo.agregar(propuesta);
                        console.log("✅ Propuesta agregada con éxito.");
                    } catch (error) {
                        console.log("❌ Error:", error.message);
                    }
                    break;

                case "Ver Lista Propuestas":
                    const propuestalist = await PropuestaRepo.listar();
                    console.log(propuestalist);
                    await inquirer.prompt([{ type: "input", name: "continuar", message: "Presiona Enter para volver..." }]);
                    break;

                case "Actualizar Propuesta":
                    const { idpropuesta } = await inquirer.prompt([
                        { type: "input", name: "idpropuesta", message: "ID a actualizar: " }
                    ]);

                    const existeActualizar = await PropuestaRepo.existe(parseInt(idpropuesta));
                    if (!existeActualizar) {
                        console.log("No existe ninguna propuesta con ese ID.");
                        break;
                    }

                    const nuevosDatos = await this.pedirDatosPropuesta();
                    if (!nuevosDatos) break;

                    nuevosDatos.idpropuesta = parseInt(nuevosDatos.idpropuesta);
                    nuevosDatos.precio = parseFloat(nuevosDatos.precio);
                    nuevosDatos.plazoDias = parseInt(nuevosDatos.plazoDias);
                    nuevosDatos.estado = nuevosDatos.estado.toLowerCase();
                    nuevosDatos.fechaCreacion = new Date();

                    const propuestaActualizada = PropuestaFactory.crearPropuesta(nuevosDatos);

                    await PropuestaRepo.ActualizarPropuesta(nuevosDatos.idpropuesta, propuestaActualizada);
                    console.log("✅ Propuesta actualizada.");
                    break;

                case "Eliminar Propuesta":
                    const { idEliminar } = await inquirer.prompt([
                        { type: "input", name: "idEliminar", message: "ID a eliminar:" }
                    ]);

                    const idEliminarNum = parseInt(idEliminar);
                    const existeEliminar = await PropuestaRepo.existe(idEliminarNum);
                    if (!existeEliminar) {
                        console.log("No existe ninguna propuesta con ese ID.");
                        break;
                    }

                    await PropuestaRepo.EliminarPropuesta(idEliminarNum);
                    console.log("✅ Propuesta eliminada.");
                    break;

                case "Retroceder":
                    salir = true;
                    console.log("👋 Saliendo del módulo de propuestas...");
                    break;
            }
        }
    }
}

module.exports = GestionPropuestas;
