const Proyecto = require("../models/Proyect");

class ProyectFactory {
    static crearProyecto(data){
        return new Proyecto(data)
    }
}

module.exports = ProyectFactory