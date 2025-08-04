const prompt = require("prompt-sync")(); // Necesario si estás en Node.js

class Cliente {
    constructor({ cedula, nombre, apellido, correo, telefono, empresa }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.empresa = empresa;

        this.validar();
    }

    validar() {
        if (!this.cedula || typeof this.cedula !== "string") {
            throw new Error("La cédula es obligatoria.");
        }

        if (!/^\d{6,12}$/.test(this.cedula)) {
            throw new Error("La cédula debe tener entre 6 y 12 dígitos numéricos.");
        }
        if (!this.nombre || typeof this.nombre !== "string") {
            throw new Error("El nombre es obligatorio porfavor ingrese uno")
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(this.nombre)) {
            throw new Error("El nombre debe tener solo letras y mínimo 2 caracteres.");
        }
        if (this.correo) {
            const emailRegex = /^[\w.-]+@[\w.-]+\.(com|co|net|org)$/i;
            if (!emailRegex.test(this.correo)) {
                throw new Error("El correo debe ser válido y terminar en .com, .co, .net o .org");
            }
        }
        if (!this.apellido || typeof this.apellido !== "string") {
            throw new Error("El apellido es obligatorio porfavor ingrese uno")
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(this.apellido)) {
            throw new Error("El apellido debe tener solo letras y mínimo 2 caracteres.");
        }
        if (!/^\d{10}$/.test(this.telefono)) {
            throw new Error("El numero debe tener minimo y maximo 10 numeros")
        }
    }
}


module.exports = Cliente
// v