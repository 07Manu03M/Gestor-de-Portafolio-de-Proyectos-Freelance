class Contrato {
    constructor({ idcontrato, nombre, condiciones, valorTotal, estado, idproyecto }) {
        this.idcontrato = idcontrato;
        this.nombre = nombre;
        this.condiciones = condiciones;
        this.valorTotal = valorTotal;
        this.estado = estado;
        this.idproyecto = idproyecto;

        this.validar();
    }

    validar() {
        if (!this.idcontrato || typeof this.idcontrato !== "string") {
            throw new Error("El ID del contrato debe ser un texto válido.");
        }
        if (!this.nombre || typeof this.nombre !== "string") {
            throw new Error("El nombre es obligatorio.");
        }
        if (!this.condiciones || typeof this.condiciones !== "string") {
            throw new Error("Debe incluir condiciones válidas.");
        }
        if (typeof this.valorTotal !== "number" || this.valorTotal <= 0) {
            throw new Error("El valor total debe ser un número positivo.");
        }
        const estadosValidos = ["firmado", "pendiente", "sin firmar", "cancelado"];
        if (!estadosValidos.includes(this.estado)) {
            throw new Error("El estado debe ser válido.");
        }
        if (!this.idproyecto) {
            throw new Error("Debe asociarse a un ID de proyecto.");
        }
    }
}

module.exports = Contrato;
