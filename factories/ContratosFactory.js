const Contrato = require("../models/contracts");

class ContratoFactory {
    static crearContrato(data) {
        return new Contrato(data);
    }
}

module.exports = ContratoFactory;
