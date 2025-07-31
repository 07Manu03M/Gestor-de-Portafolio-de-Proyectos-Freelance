const Cliente = require("../models/client");

class ClienteFactory {
    static crearCliente(data) {
        return new Cliente(data);
    }
}

module.exports = ClienteFactory