class Finanza {
  constructor({ idProyecto, tipo, descripcion, valor, fecha,  }) {
    this.idProyecto = idProyecto;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.valor = valor;
    this.fecha = fecha;
    this.idProyecto = idProyecto;

    this.validar();
  }

  validar() {
    if (!this.tipo || !['ingreso', 'egreso'].includes(this.tipo)) {
      throw new Error('El tipo debe ser "ingreso" o "egreso".');
    }

    if (!this.descripcion || typeof this.descripcion !== 'string') {
      throw new Error('La descripción es obligatoria.');
    }

    if (typeof this.valor !== 'number' || this.valor <= 0) {
      throw new Error('El valor debe ser un número positivo.');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.fecha)) {
      throw new Error('La fecha debe tener formato YYYY-MM-DD.');
    }
  }
}

module.exports = Finanza;

