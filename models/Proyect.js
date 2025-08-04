const prompt = require("prompt-sync")();

class Proyecto {
    constructor({ idproyecto, nombre, descripcion, cedulacliente, idpropuesta, estado, fechaInicio, fechaFin, valorTotal, progreso }) {
        this.idproyecto = idproyecto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cedulacliente = cedulacliente;
        this.idpropuesta = idpropuesta;
        this.estado = estado;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.valorTotal = valorTotal;
        this.progreso = progreso;

        this.validar();
    }

    validar() {
        if (!this.idproyecto || typeof this.idproyecto !== "string") {
            throw new Error("El id es obligatorio y debe ser texto");
        }
        if (!/^\d+$/.test(this.idproyecto)) {
            throw new Error("El ID debe tener al menos un dígito positivo");
        }

        if (!this.nombre || typeof this.nombre !== "string") {
            throw new Error("El nombre es obligatorio.");
        }

        if (!this.descripcion || typeof this.descripcion !== "string" || this.descripcion.length < 15) {
            throw new Error("La descripción debe ser texto y tener al menos 15 caracteres.");
        }

        const estadosValidos = ["activo", "pausado", "finalizado", "cancelado"];
        if (!estadosValidos.includes(this.estado)) {
            throw new Error("El estado debe ser: activo, pausado, finalizado o cancelado.");
        }

        if (typeof this.valorTotal !== "number" || this.valorTotal <= 0) {
            throw new Error("El valor total debe ser un número mayor que 0.");
        }

        if (typeof this.progreso !== "number" || this.Avance < 0 || this.progreso > 100) {
            throw new Error("El avance debe ser un número entre 0 y 100.");
        }
    }
}

module.exports = Proyecto







