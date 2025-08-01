const prompt = require("prompt-sync")();

class Propuesta {
    constructor({ idpropuesta, cedulaCliente, descripcion, precio, plazoDias, estado, fechaCreacion }) {
        this.idpropuesta = idpropuesta;
        this.cedulaCliente = cedulaCliente;
        this.descripcion = descripcion;
        this.precio = precio;
        this.plazoDias = plazoDias;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;


        this.validar();
    }

    validar() {
        if (!this.idpropuesta || typeof this.idpropuesta !== "number") {
            throw new Error("La id es obligatoria y debe ser numero.");
        }
        if (!this.descripcion || typeof this.descripcion !== "string") {
            throw new Error("La descripción es obligatoria porfavor ingresa la descripcion")
        }
        if (!this.descripcion || this.descripcion.length < 10) {
            throw new Error("La descripcion debe ser solo texto y tener almenos 15 caracteres")
        }
        if (typeof this.precio !== "number" || this.precio <= 0) {
            throw new Error("El precio debe ser un número mayor que 0.");
        }
        if (!Number.isInteger(this.plazoDias) || this.plazoDias <= 0) {
            throw new Error("El plazo debe ser un número entero positivo.");
        }
        const estadosValidos = ["pendiente", "aceptada", "rechazada"];
        if (!estadosValidos.includes(this.estado)) {
            throw new Error("El estado debe ser: pendiente, aceptada o rechazada.");
        }
    }
}

module.exports = Propuesta;