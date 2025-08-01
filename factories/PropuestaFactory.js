const Propuesta = require("../models/propuesta");

class PropuestaFactory{
    static crearPropuesta(data) {
        return new Propuesta(data);
    }
}

module.exports = PropuestaFactory