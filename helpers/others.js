const { request } = require("express");

const infoBusquedas = (req = request) =>{
    let {salto, limite} = req.query

    salto = Number(salto)
    limite = Number(limite)

    salto = isNaN(salto) ? 0 : (salto < 0) ? 0 : salto
    limite = isNaN(limite) ? 15 : (limite < 0) ? 15 : limite

    let nuevo_salto = salto + limite;
    let next = req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '?salto=' + nuevo_salto + '&limite=' + limite;

    let previous = null
    if(salto > 0){
        let salto_previo = (salto - limite > 0) ? salto-limite : 0
        previous = req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '?salto=' + salto_previo + '&limite=' + limite;
    }

    let data = {
        previous,
        next,
        limite,
        salto
    }

    return data
}

module.exports = {
    infoBusquedas
}