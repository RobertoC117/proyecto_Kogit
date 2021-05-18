const { request, response } = require("express")
const { infoBusquedas } = require("../helpers/others")
const { Post } = require("../models")

const buscar = (req = request, res = response) =>{
    let {valor} = req.body
    let {termino} = req.params
    //console.log(req.hostname + req.baseUrl +req.path)
    let metodos = {
        tags: buscarTags,
        lenguaje: buscarLenguaje
    }

    if(!metodos.hasOwnProperty(termino)){
        return res.status(400).json({ok:false, errors:[{msg: 'Este termino de busqueda no existe, intente tags o lenguaje'}]})
    }

    metodos[termino](valor, infoBusquedas(req), res)
}

const buscarTags = async(valor, info ,res = response) =>{
    try {
        
        if(!Array.isArray(valor)){
            return res.status(400).json({
                ok: false,
                errors:[
                    {
                        msg: 'El valor proporcionado debe ser un array' 
                    }
                ]
            })
        }

        for (let i = 0; i < valor.length; i++) {
            valor[i] = new RegExp(valor[i],'i')
        }
        
        const posts = await Post.find({tags:{ $in: valor }, estado: true})
                                .populate('autor', ['nombre','username','imgURL'])
                                .skip(info.salto)
                                .limit(info.limite)

        const total = await Post.countDocuments({tags:{ $in: valor }, estado: true})

        res.json({
            ok: true,
            total,
            previous: info.previous,
            next: info.next,
            posts: posts ? posts : []
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const buscarLenguaje = async(valor, info, res = response) =>{
    try {
        
        const leng_regex = new RegExp(valor, 'i')
        
        const posts = await Post.find({lenguaje: leng_regex, estado: true})
                                .populate('autor', ['nombre','username','imgURL'])
                                .skip(info.salto)
                                .limit(info.limite)

        const total = await Post.countDocuments({lenguaje: leng_regex, estado: true})
        
        res.json({
            ok: true,
            total,
            previous: info.previous,
            next: info.next,
            posts: posts ? posts : []
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

module.exports = {
    buscar
}