const inquirer = require("inquirer");
const PropuestaRepo = require("../service/propuesta")
const PropuestaFactory = require("../factories/PropuestaFactory");


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


                case "Retroceder":
                    salir = true;
                    console.log("Bye ;3");
                    break;
            }
        }
    }
}

module.exports = GestionPropuestas