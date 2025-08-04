class Avance {
    constructor({ idAvance, descripcion, fecha, porcentaje, proyectoId }) {
        this.idAvance = idAvance;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.porcentaje = porcentaje;
        this.proyectoId = proyectoId;

        this.validar();
    }

    validar() {
        if (!this.idAvance || typeof this.idAvance !== "string") {
            throw new Error("El ID del avance es obligatorio y debe ser texto.");
        }

        if (!this.descripcion || this.descripcion.length < 10) {
            throw new Error("La descripción debe tener al menos 10 caracteres.");
        }

        if (!this.fecha || isNaN(Date.parse(this.fecha))) {
            throw new Error("La fecha debe estar en formato válido (YYYY-MM-DD).");
        }

        if (typeof this.porcentaje !== "number" || this.porcentaje < 0 || this.porcentaje > 100) {
            throw new Error("El porcentaje debe estar entre 0 y 100.");
        }

        if (!this.proyectoId || typeof this.proyectoId !== "string") {
            throw new Error("El ID del proyecto es obligatorio.");
        }
    }
}

module.exports = Avance;
