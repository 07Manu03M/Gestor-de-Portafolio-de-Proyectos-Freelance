const inquirer = require("inquirer");
const ContratoRepo = require("../service/contrato");
const ContratoFactory = require("../factories/ContratosFactory");
const ProyectoRepo = require("../service/proyecto");

class GestionContratos {
    static async seleccionarProyectoParaContrato() {
        const proyectos = await ProyectoRepo.verproyectos();
        const contratos = await ContratoRepo.listarContratos();
        const idsConContrato = contratos.map(c => c.idproyecto);

        const proyectosSinContrato = proyectos.filter(p => !idsConContrato.includes(p.idproyecto));

        if (!proyectosSinContrato.length) {
            console.log("❌ Todos los proyectos ya tienen contratos.");
            return null;
        }

        const opciones = proyectosSinContrato.map(p => ({
            name: `#${p.idproyecto} - ${p.nombre} | Cliente: ${p.cedulacliente} | $${p.valorTotal}`,
            value: p
        }));

        const { proyectoSeleccionado } = await inquirer.prompt([
            {
                type: "list",
                name: "proyectoSeleccionado",
                message: "Selecciona un proyecto sin contrato:",
                choices: opciones
            }
        ]);

        return proyectoSeleccionado;
    }

    static async pedirdatosContratoDesdeProyecto(proyecto, nuevoId) {
        const condiciones = `Este contrato establece que el proyecto "${proyecto.nombre}" será ejecutado según la descripción: "${proyecto.descripcion}". El cliente identificado con cédula ${proyecto.cedulacliente} acepta un valor total de $${proyecto.valorTotal}.`;

        const { estado } = await inquirer.prompt([
            {
                type: "list",
                name: "estado",
                message: "Selecciona el estado del contrato:",
                choices: ["firmado", "pendiente", "sin firmar"]
            }
        ]);

        return {
            idcontrato: String(nuevoId),
            nombre: `Contrato ${proyecto.nombre}`,
            condiciones,
            valorTotal: proyecto.valorTotal,
            estado,
            idproyecto: proyecto.idproyecto
        };
    }

    static async pedirdatosContrato() {
        return await inquirer.prompt([
            {
                type: "input",
                name: "idcontrato",
                message: "ID del contrato:"
            },
            {
                type: "input",
                name: "nombre",
                message: "Nombre del contrato:"
            },
            {
                type: "input",
                name: "condiciones",
                message: "Condiciones del contrato:"
            },
            {
                type: "number",
                name: "valorTotal",
                message: "Valor total del contrato:"
            },
            {
                type: "list",
                name: "estado",
                message: "Estado del contrato:",
                choices: ["activo", "inactivo", "firmado", "cancelado"]
            }
        ]);
    }

    static async generarNuevoIdContrato() {
        const lista = await ContratoRepo.listarContratos();
        if (!lista.length) return 1;
        const ids = lista.map(c => parseInt(c.idcontrato)).filter(n => !isNaN(n));
        return Math.max(...ids) + 1;
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
                        "Agregar un Contrato",
                        "Ver Lista de Contratos",
                        "Actualizar Contrato",
                        "Eliminar Contrato",
                        "Retroceder"
                    ]
                }
            ]);

            switch (opcion) {
                case "Agregar un Contrato":
                    try {
                        const proyecto = await this.seleccionarProyectoParaContrato();
                        if (!proyecto) break;

                        const nuevoId = await this.generarNuevoIdContrato();
                        const data = await this.pedirdatosContratoDesdeProyecto(proyecto, nuevoId);
                        const contrato = ContratoFactory.crearContrato(data);

                        const existe = await ContratoRepo.existe(contrato.idcontrato);
                        if (existe) {
                            console.log("Ya existe un contrato con ese ID");
                            break;
                        }

                        await ContratoRepo.agregarcontraro(contrato);
                        console.log("✅ Contrato creado con éxito");
                    } catch (error) {
                        console.log("❌ Error:", error.message);
                    }
                    break;

                case "Ver Lista de Contratos":
                    const lista = await ContratoRepo.listarContratos();
                    console.log(lista);
                    await inquirer.prompt([{ type: "input", name: "continuar", message: "Presiona ENTER para volver..." }]);
                    break;

                case "Actualizar Contrato":
                    const { idcontrato } = await inquirer.prompt([
                        { type: "input", name: "idcontrato", message: "ID del contrato a actualizar:" }
                    ]);

                    const existeActualizar = await ContratoRepo.existe(idcontrato);
                    if (!existeActualizar) {
                        console.log("No existe ningún contrato con ese ID.");
                        break;
                    }

                    const contratoOriginal = await ContratoRepo.buscarContratoPorId(idcontrato);
                    const nuevosDatos = await this.pedirdatosContrato();
                    nuevosDatos.idproyecto = contratoOriginal.idproyecto;
                    nuevosDatos.valorTotal = Number(nuevosDatos.valorTotal);

                    const contratoActualizado = ContratoFactory.crearContrato(nuevosDatos);
                    await ContratoRepo.actualizarContrato(idcontrato, contratoActualizado);
                    console.log("✅ Contrato actualizado");
                    break;

                case "Eliminar Contrato":
                    const { idEliminar } = await inquirer.prompt([
                        { type: "input", name: "idEliminar", message: "ID del contrato a eliminar:" }
                    ]);

                    const existeEliminar = await ContratoRepo.existe(idEliminar);
                    if (!existeEliminar) {
                        console.log("No existe ningún contrato con ese ID.");
                        break;
                    }

                    await ContratoRepo.eliminarContrato(idEliminar);
                    console.log("🗑️ Contrato eliminado");
                    break;

                case "Retroceder":
                    salir = true;
                    console.log("👋 Bye");
                    break;
            }
        }
    }
}

module.exports = GestionContratos;



