const inquirer = require("inquirer");
const AvancesFactory = require("../factories/AvancesFactory");
const AvanceRepo = require("../service/avance");
const ProyectoRepo = require("../service/proyecto");

class GestionAvances {
    static async seleccionarProyecto() {
        const proyectos = await ProyectoRepo.verproyectos();

        if (!proyectos.length) {
            console.log("❌ No hay proyectos disponibles.");
            return null;
        }

        const opciones = proyectos.map(p => ({
            name: `#${p.idproyecto} - ${p.nombre} | Progreso actual: ${p.progreso || 0}%`,
            value: p
        }));

        const { proyectoSeleccionado } = await inquirer.prompt([
            {
                type: "list",
                name: "proyectoSeleccionado",
                message: "Selecciona el proyecto para el avance:",
                choices: opciones
            }
        ]);

        return proyectoSeleccionado;
    }

    static async pedirDatosAvance(proyecto) {
        const data = await inquirer.prompt([
            { type: "input", name: "idAvance", message: "ID del avance:" },
            { type: "input", name: "descripcion", message: "Descripción del avance:" },
            { type: "input", name: "fecha", message: "Fecha del avance (YYYY-MM-DD):" },
            { type: "input", name: "porcentaje", message: "¿Cuánto porcentaje representa este avance? (0-100):" }
        ]);
        data.porcentaje = Number(data.porcentaje);
        data.proyectoId = proyecto.idproyecto;
        return data;
    }

    static async menu() {
        let salir = false;
        while (!salir) {
            const { opcion } = await inquirer.prompt([
                {
                    type: "list",
                    name: "opcion",
                    message: "Gestión de Avances:",
                    choices: [
                        "Agregar Avance",
                        "Ver Lista de Avances",
                        "Actualizar Avance",
                        "Eliminar Avance",
                        "Retroceder"
                    ]
                }
            ]);

            switch (opcion) {
                case "Agregar Avance":
                    try {
                        const proyecto = await this.seleccionarProyecto();
                        if (!proyecto) break;

                        const data = await this.pedirDatosAvance(proyecto);
                        const existe = await AvanceRepo.existe(data.idAvance);
                        if (existe) {
                            console.log("❌ Ya existe un avance con ese ID.");
                            break;
                        }

                        const avance = AvancesFactory.crearAvance(data);
                        await AvanceRepo.agregar(avance);

                        const nuevoProgreso = (proyecto.progreso || 0) + avance.porcentaje;
                        await ProyectoRepo.actualizarProgreso(proyecto.idproyecto, nuevoProgreso);

                        console.log("✅ Avance agregado y progreso actualizado.");
                    } catch (error) {
                        console.log("❌ Error:", error.message);
                    }
                    break;

                case "Ver Lista de Avances":
                    const lista = await AvanceRepo.listar();
                    console.table(lista);
                    break;

                case "Actualizar Avance":
                    const { idActualizar } = await inquirer.prompt([
                        { type: "input", name: "idActualizar", message: "ID del avance a actualizar:" }
                    ]);

                    const avanceAnterior = await AvanceRepo.obtenerPorId(idActualizar);
                    if (!avanceAnterior) {
                        console.log("❌ No existe un avance con ese ID.");
                        break;
                    }

                    const proyectoA = await ProyectoRepo.buscarPorId(avanceAnterior.proyectoId);
                    if (!proyectoA) {
                        console.log("❌ Proyecto relacionado no encontrado.");
                        break;
                    }

                    const nuevosDatos = await this.pedirDatosAvance(proyectoA);
                    await AvanceRepo.actualizar(idActualizar, nuevosDatos);

                    const diferencia = nuevosDatos.porcentaje - avanceAnterior.porcentaje;
                    const nuevoProgresoA = (proyectoA.progreso || 0) + diferencia;
                    await ProyectoRepo.actualizarProgreso(proyectoA.idproyecto, nuevoProgresoA);

                    console.log("✅ Avance actualizado y progreso ajustado.");
                    break;

                case "Eliminar Avance":
                    const { idEliminar } = await inquirer.prompt([
                        { type: "input", name: "idEliminar", message: "ID del avance a eliminar:" }
                    ]);

                    const avanceEliminar = await AvanceRepo.obtenerPorId(idEliminar);
                    if (!avanceEliminar) {
                        console.log("❌ No existe un avance con ese ID.");
                        break;
                    }

                    const proyectoE = await ProyectoRepo.buscarPorId(avanceEliminar.proyectoId);
                    if (proyectoE) {
                        const nuevoProgresoE = (proyectoE.progreso || 0) - avanceEliminar.porcentaje;
                        await ProyectoRepo.actualizarProgreso(proyectoE.idproyecto, nuevoProgresoE);
                    }

                    await AvanceRepo.eliminar(idEliminar);
                    console.log("🗑️ Avance eliminado y progreso ajustado.");
                    break;

                case "Retroceder":
                    salir = true;
                    break;
            }
        }
    }
}

module.exports = GestionAvances;

