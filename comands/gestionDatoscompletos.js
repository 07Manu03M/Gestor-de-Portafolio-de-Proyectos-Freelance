const inquirer = require("inquirer");
const ClienteRepo = require("../service/cliente");
const DatosCompletos = require("../factories/datoscompletosFactory");
const DatosRepo = require("../service/datoscompletos")

class GestionDatosCompletos {
    static async menu() {
        let salir = false;
        while(!salir) {
            const{ opcion } = await inquirer.prompt([
                {
                    type: "list",
                    name: "opcion",
                    message: "Selecciona una opcion",
                    choices: [
                        "Ver Informacion Cliente",
                        "Retroceder"
                    ]
                }
            ]);

            switch (opcion) {
                case "Ver Informacion Cliente":
                    try{
                        const Clientes = await ClienteRepo.ListarClientes();
                        
                        if(Clientes.length === 0){
                            console.log("X No hay clientes registradi. Primero crea uno.")
                            return null;
                        }
                        const opcionesClientes = Clientes.map(c => ({
                            name: `${c.cedula} - ${c.nombre}`,
                            value: c.cedula
                        }));

                        const { ClienteSeleccionado } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "ClienteSeleccionado",
                                message: "Selecciona un cliente para ver su informacion",
                                choices: Clientes.map(p => ({
                                    name: `Cliente:${p.cedula}`,
                                    value: p
                                }))
                            }
                        ]);
                        const cliente = ClienteSeleccionado
                        
                        const resumenData = {
                            cedula: `Cedula: ${cliente.cedula}`,
                            nombre: cliente.nombre,
                            apellido: cliente.apellido,
                            correo: cliente.correo,
                            telefono: cliente.telefono,
                            empresa: cliente.empresa
                        };

                        const alldata = DatosCompletos.crearresumendatos(resumenData);
                        await DatosRepo.agregarDatos(alldata);
                        console.log("el resumen de datos ha sido añadido")

                    }catch (error) {
                        console.log("Error al crear resumen de datos", error.message)
                    }
                    break;

                    case "Retroceder":
                        salir = true;
                        console.log("bye");
                        break
            }
        }
    }
}

module.exports = GestionDatosCompletos




// En este examen solo se logro mostrar la informacion del cliente por medio de la consola 
// ejecutando la aplicacion por medio del comando "node app.js"
// en el apartado de "informacion General"
// y luego dar en ver "Informacion Cliente"
// Recordar tener clientes agregarDatos
// seleccionas el cliente y solo reune la informacion del mismo luego verificar en la base de datos de mongo
// no me quedo tiempo de listarlos xd
