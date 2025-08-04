const Avance = require("../models/avanced");

class AvancesFactory {
    static crearAvance(data) {
        return new Avance(data);
    }
}

module.exports = AvancesFactory;
