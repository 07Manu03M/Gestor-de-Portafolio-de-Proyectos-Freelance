const datoscompletos = require("../models/datoscompletos");

class DatosCompletos {
    static crearresumendatos(data){
        return new datoscompletos(data);
    }
}

module.exports = DatosCompletos