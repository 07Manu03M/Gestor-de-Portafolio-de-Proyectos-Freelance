const prompt = require("prompt-sync")(); // Necesario si estás en Node.js

class datoscompletos {
    constructor({ cedula, nombre, apellido, correo, telefono, empresa, proyectos, contratos, entregables, ingreso, egreso}) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.empresa = empresa;
        this.proyectos = proyectos;
        this.contratos = contratos;
        this.entregables = entregables;
        this.ingreso = ingreso;
        this.egreso = egreso;
    }
}


module.exports = datoscompletos