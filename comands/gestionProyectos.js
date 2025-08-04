const inquirer = require("inquirer");
const ProyectoRepo = require("../service/proyecto");
const PropuestaRepo = require("../service/propuesta");
const ProyectFactory = require("../factories/ProyectosFactory");
const Table = require('cli-table3');

class GestionProyectos {
    static async menu() {
        let salir = false;

        while (!salir) {
            const { opcion } = await inquirer.prompt([
                {
                    type: "list",
                    name: "opcion",
                    message: "Selecciona una opción",
                    choices: [
                        "Crear proyecto desde propuesta",
                        "Mostrar Proyectos",
                        "Actualizar Proyecto",
                        "Eliminar Proyecto",
                        "Retroceder"
                    ]
                }
            ]);

            switch (opcion) {
                case "Crear proyecto desde propuesta":
                    try {
                        const propuestas = await PropuestaRepo.listar();

                        const aceptadas = propuestas.filter(p =>
                            String(p.estado || "").trim().toLowerCase() === "aceptada"
                        );

                        if (aceptadas.length === 0) {
                            console.log("❌ No hay propuestas aceptadas disponibles.");
                            break;
                        }

                        const { propuestaSeleccionada } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "propuestaSeleccionada",
                                message: "Selecciona una propuesta aceptada para convertirla en proyecto:",
                                choices: aceptadas.map(p => ({
                                    name: `#${p.idpropuesta} - Cliente: ${p.cedulaCliente} | $${p.precio}`,
                                    value: p
                                }))
                            }
                        ]);

                        const propuesta = propuestaSeleccionada;

                        const yaExisteProyecto = (await ProyectoRepo.verproyectos()).some(p => p.idpropuesta === propuesta.idpropuesta);
                        if (yaExisteProyecto) {
                            console.log("❌ Ya existe un proyecto creado con esta propuesta.");
                            break;
                        }

                        const fechaInicio = new Date();
                        const fechaFin = new Date();
                        fechaFin.setDate(fechaInicio.getDate() + propuesta.plazoDias);

                        const proyectoData = {
                            idproyecto: String(Date.now()),
                            nombre: `Proyecto ${propuesta.idpropuesta}`,
                            descripcion: propuesta.descripcion,
                            cedulacliente: propuesta.cedulaCliente,
                            idpropuesta: propuesta.idpropuesta,
                            estado: "activo",
                            fechaInicio,
                            fechaFin,
                            valorTotal: propuesta.precio,
                            progreso: 0
                        };

                        const proyecto = ProyectFactory.crearProyecto(proyectoData);
                        await ProyectoRepo.agregarproyecto(proyecto);
                        console.log("✅ Proyecto creado con éxito a partir de la propuesta.");

                    } catch (error) {
                        console.log("❌ Error al crear el proyecto:", error.message);
                    }
                    break;

                case "Mostrar Proyectos":
                    try {
                        const lista = await ProyectoRepo.verproyectos();

                        if (lista.length === 0) {
                            console.log("📭 No hay proyectos registrados.");
                            break;
                        }

                        const table = new Table({
                            head: ['ID', 'Estado', 'Cliente', 'Valor', 'Avance', 'Inicio', 'Fin'],
                            style: { head: ['cyan'] }
                        });

                        lista.forEach(p => {
                            table.push([
                                p.idproyecto,
                                p.estado,
                                p.cedulacliente,
                                `$${p.valorTotal}`,
                                `${p.progreso}%`,
                                new Date(p.fechaInicio).toLocaleDateString(),
                                new Date(p.fechaFin).toLocaleDateString()
                            ]);
                        });

                        console.log(table.toString());

                    } catch (error) {
                        console.log("❌ Error al mostrar proyectos:", error.message);
                    }

                    await inquirer.prompt([{ type: "input", name: "continuar", message: "Presiona ENTER para volver..." }]);
                    break;

                case "Actualizar Proyecto":
                    try {
                        const proyectos = await ProyectoRepo.verproyectos();
                        if (proyectos.length === 0) {
                            console.log("📭 No hay proyectos para actualizar.");
                            break;
                        }

                        const { proyectoId } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "proyectoId",
                                message: "Selecciona un proyecto a actualizar:",
                                choices: proyectos.map(p => ({
                                    name: `#${p.idproyecto} - Estado: ${p.estado} - Cliente: ${p.cedulacliente}`,
                                    value: p.idproyecto
                                }))
                            }
                        ]);

                        const { nuevoEstado, nuevoAvance } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "nuevoEstado",
                                message: "Nuevo estado del proyecto:",
                                choices: ["activo", "en pausa", "finalizado"]
                            },
                            {
                                type: "input",
                                name: "nuevoAvance",
                                message: "Nuevo porcentaje de avance (0-100):",
                                validate: input => {
                                    const num = Number(input);
                                    return !isNaN(num) && num >= 0 && num <= 100;
                                }
                            }
                        ]);

                        await ProyectoRepo.actualizarProyecto(proyectoId, {
                            estado: nuevoEstado,
                            Avance: Number(nuevoAvance)
                        });

                        console.log("✅ Proyecto actualizado con éxito.");

                    } catch (error) {
                        console.log("❌ Error al actualizar proyecto:", error.message);
                    }
                    break;

                case "Eliminar Proyecto":
                    try {
                        const proyectos = await ProyectoRepo.verproyectos();
                        if (proyectos.length === 0) {
                            console.log("📭 No hay proyectos para eliminar.");
                            break;
                        }

                        const { idEliminar } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "idEliminar",
                                message: "Selecciona un proyecto para eliminar:",
                                choices: proyectos.map(p => ({
                                    name: `#${p.idproyecto} - Cliente: ${p.cedulacliente}`,
                                    value: p.idproyecto
                                }))
                            }
                        ]);

                        await ProyectoRepo.eliminarproyecto(idEliminar);
                        console.log("🗑️ Proyecto eliminado con éxito.");

                    } catch (error) {
                        console.log("❌ Error al eliminar proyecto:", error.message);
                    }
                    break;

                case "Retroceder":
                    salir = true;
                    console.log("👋 Bye ;3");
                    break;
            }
        }
    }
}

module.exports = GestionProyectos;



