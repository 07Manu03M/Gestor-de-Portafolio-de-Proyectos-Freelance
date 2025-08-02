const inquirer = require("inquirer");
const ProyectoRepo = require("../service/proyecto");
const ProyectFactory = require("../factories/ProyectosFactory");
const ClienteRepo = require("../service/cliente");
const Table = require('cli-table3');

class GestionProyectos {
    static async pedirDatosProyecto() {
        return await inquirer.prompt([
            { type: "input", name: "idproyecto", message: "Ingrese el id:" },
            { type: "input", name: "nombre", message: "Ingrese el nombre del proyecto:" },
            { type: "input", name: "descripcion", message: "Ingrese la descripcion:" },
            { type: "input", name: "estado", message: "Ingrese el estado del proyecto (activo, pausado, finalizado, cancelado):" },
            { type: "input", name: "valorTotal", message: "Ingrese el valor total del proyecto:" },
            { type: "input", name: "Avance", message: "Ingrese el progreso del proyecto de 0 a 100%:" },
            { type: "input", name: "plazoDias", message: "¿Cuántos días durará el proyecto?" }
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
                        "Agregar un proyecto",
                        "Mostrar Proyectos",
                        "Actualizar Proyecto",
                        "Eliminar Proyecto",
                        "Retroceder"
                    ]
                }
            ]);

            switch (opcion) {
                case "Agregar un proyecto":
                    try {
                        const data = await this.pedirDatosProyecto();

                        // Conversiones de datos
                        data.valorTotal = parseFloat(data.valorTotal);
                        data.Avance = parseFloat(data.Avance);
                        data.plazoDias = parseInt(data.plazoDias);

                        // Fechas automáticas
                        data.fechaInicio = new Date();
                        data.fechaFin = new Date();
                        data.fechaFin.setDate(data.fechaInicio.getDate() + data.plazoDias);

                        const proyecto = ProyectFactory.crearProyecto(data);
                        const existe = await ProyectoRepo.existe(proyecto.idproyecto);

                        if (existe) {
                            console.log("Ya existe un proyecto con ese ID.");
                            break;
                        }

                        await ProyectoRepo.agregarproyecto(proyecto);
                        console.log("Proyecto agregado con éxito.");
                    } catch (error) {
                        console.log("Error:", error.message);
                    }
                    break;

                case "Mostrar Proyectos":
                    try {
                        const lista = await ProyectoRepo.verproyectos();

                        if (lista.length === 0) {
                            console.log("No hay proyectos registrados.");
                            break;
                        }

                        const table = new Table({
                            head: ['ID', 'Nombre', 'Estado', 'Valor', 'Avance', 'Inicio', 'Fin'],
                            wordWrap: true,
                            style: { head: ['cyan'] }
                        });

                        lista.forEach(p => {
                            table.push([
                                p.idproyecto,
                                p.nombre,
                                p.estado,
                                `$${p.valorTotal}`,
                                `${p.Avance}%`,
                                new Date(p.fechaInicio).toLocaleDateString(),
                                new Date(p.fechaFin).toLocaleDateString()
                            ]);
                        });

                        console.log(table.toString());

                    } catch (error) {
                        console.log("Error al mostrar proyectos:", error.message);
                    }

                    await inquirer.prompt([{ type: "input", name: "continuar", message: "Presiona ENTER para volver..." }]);
                    break;

                case "Actualizar Proyecto":
                    const { idproyecto } = await inquirer.prompt([
                        { type: "input", name: "idproyecto", message: "ID a actualizar: " }
                    ]);

                    const existeActualizar = await ProyectoRepo.existe(idproyecto);

                    if (!existeActualizar) {
                        console.log("No existe ningún proyecto con ese ID.");
                        break;
                    }

                    const nuevosDatos = await this.pedirDatosProyecto();

                    nuevosDatos.idproyecto = idproyecto;
                    nuevosDatos.valorTotal = parseFloat(nuevosDatos.valorTotal);
                    nuevosDatos.plazoDias = parseInt(nuevosDatos.plazoDias);
                    nuevosDatos.estado = nuevosDatos.estado.toLowerCase();
                    nuevosDatos.Avance = parseFloat(nuevosDatos.Avance);

                    nuevosDatos.fechaInicio = new Date();
                    nuevosDatos.fechaFin = new Date();
                    nuevosDatos.fechaFin.setDate(nuevosDatos.fechaInicio.getDate() + nuevosDatos.plazoDias);

                    const proyectoActualizado = ProyectFactory.crearProyecto(nuevosDatos);

                    await ProyectoRepo.ActualizarProyecto(idproyecto, proyectoActualizado);
                    console.log("Proyecto actualizado con éxito.");
                    break;

                case "Eliminar Proyecto":
                    const { ideliminar } = await inquirer.prompt([{ type: "input", name: "ideliminar", message: "Id a eliminar" }]);
                    const existeEliminar = await ProyectoRepo.existe(ideliminar);

                    if (!existeEliminar) {
                        console.log("No existe ningun proyecto con ese id.");
                        break;
                    }

                    console.log("Proyectos antes de eliminar:");
                    console.log(await ProyectoRepo.verproyectos());

                    await ProyectoRepo.EliminarProyecto(ideliminar);

                    console.log("Proyectos después de eliminar:");
                    console.log(await ProyectoRepo.verproyectos());

                    console.log("ID eliminado.");
                    break;

                case "Retroceder":
                    salir = true;
                    console.log("Bye ;3");
                    break;
            }
        }
    }
}

module.exports = GestionProyectos;

