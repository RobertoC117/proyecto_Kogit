const { request } = require("express");

const infoBusquedas = (req = request, options = {hasValor: false}) =>{
    
    let {salto, limite, valor} = req.query

    salto = Number(salto)
    limite = Number(limite)

    salto = isNaN(salto) ? 0 : (salto < 0) ? 0 : salto
    limite = isNaN(limite) ? 15 : (limite < 0) ? 15 : limite

    //let URL_BASE = req.protocol + '://' + req.get('host') + req.baseUrl + req.path
    let URL_BASE = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`

    if(options.hasValor){
        valor = valor.replace(/ /g, "+")
        URL_BASE = `${URL_BASE}?valor=${valor}&`
    }else{
        URL_BASE = `${URL_BASE}?`
    }

    let nuevo_salto = salto + limite;
    let next = `${URL_BASE}salto=${nuevo_salto}&limite=${limite}`

    let previous = null
    if(salto > 0){
        let salto_previo = (salto - limite > 0) ? salto-limite : 0
        previous = `${URL_BASE}salto=${salto_previo}&limite=${limite}`
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