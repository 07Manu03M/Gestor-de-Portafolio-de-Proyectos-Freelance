const inquirer = require("inquirer");
const PropuestaRepo = require("../service/propuesta")
const PropuestaFactory = require("../factories/PropuestaFactory");
const ClienteRepo = require("../service/cliente");


class GestionPropuestas {
    static async pedirDatosPropuesta() {
        return await inquirer.prompt([
            { type: "input", name: "idpropuesta", message: "Ingresa el id: " },
            { type: "input", name: "descripcion", message: "Ingrese la descripcion de la propuesta: " },
            { type: "input", name: "precio", message: "ingrese el valor de la propuesta: " },
            { type: "input", name: "plazoDias", message: "ingrese el plazo maximo en dias: " },
            { type: "input", name: "estado", message: "Ingrese el estado (Pendiente, Aceptada o Rechazada" },
        ]);
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

                        // 👇 Aquí haces la conversión de tipos
                        data.idpropuesta = parseInt(data.idpropuesta);
                        data.precio = parseFloat(data.precio);
                        data.plazoDias = parseInt(data.plazoDias);
                        data.estado = data.estado.toLowerCase();

                        const propuesta = PropuestaFactory.crearPropuesta(data);
                        const existe = await PropuestaRepo.existe(propuesta.idpropuesta);

                        if (existe) {
                            console.log("Ya existe una propuesta con ese ID.");
                            break;
                        }

                        await PropuestaRepo.agregar(propuesta);
                        console.log("Propuesta agregada con exito");
                    } catch (error) {
                        console.log("error", error.message);
                    }
                    break;

                case "Ver Lista Propuestas":
                    const propuestalist = await PropuestaRepo.ListarPropuestas();
                    console.log(propuestalist);
                    await inquirer.prompt([{ type: "input", name: "continuar", message: "Presiona Enter para volver...." }]);
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

                    // 👇 Conversión de tipos aquí (muy importante)
                    nuevosDatos.idpropuesta = parseInt(nuevosDatos.idpropuesta);
                    nuevosDatos.precio = parseFloat(nuevosDatos.precio);
                    nuevosDatos.plazoDias = parseInt(nuevosDatos.plazoDias);
                    nuevosDatos.estado = nuevosDatos.estado.toLowerCase();

                    const propuestaActualizada = PropuestaFactory.crearPropuesta(nuevosDatos);

                    await PropuestaRepo.ActualizarPropuesta(nuevosDatos.idpropuesta, propuestaActualizada);
                    console.log("Propuesta Actualizada");
                    break;

                case "Eliminar Propuesta":
                    const { idEliminar } = await inquirer.prompt([
                        { type: "input", name: "idEliminar", message: "Id a Eliminar" }
                    ]);

                    const idEliminarNum = parseInt(idEliminar);

                    const existeEliminar = await PropuestaRepo.existe(idEliminarNum);
                    if (!existeEliminar) {
                        console.log("No existe ninguna propuesta con ese id");
                        break;
                    }

                    await PropuestaRepo.EliminarPropuesta(idEliminarNum);
                    console.log("Propuesta Eliminada");
                    break;


                case "Retroceder":
                    salir = true;
                    console.log("Bye ;3");
                    break;
            }
        }
    }
}

module.exports = GestionPropuestas