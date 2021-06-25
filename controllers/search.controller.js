const { request, response } = require("express")
const { infoBusquedas } = require("../helpers/others")
const { Post } = require("../models")

const buscar = (req = request, res = response) =>{
    let {valor} = req.body
    let {termino} = req.params
    const {_id} = req.usuarioAutenticado
    //console.log(req.hostname + req.baseUrl +req.path)
    let metodos = {
        tags: buscarTags,
        lenguaje: buscarLenguaje
    }

    if(!metodos.hasOwnProperty(termino)){
        return res.status(400).json({ok:false, errors:[{msg: 'Este termino de busqueda no existe, intente tags o lenguaje'}]})
    }

    metodos[termino](valor, _id,  infoBusquedas(req), res)
}

const buscarTags = async(valor, idUser, info ,res = response) =>{
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
        
        const resultados = await Post.find({tags:{ $in: valor }, estado: true})
                                .populate('autor', ['nombre','username','imgURL'])
                                .skip(info.salto)
                                .limit(info.limite)
        
        let posts = [];

        resultados.forEach((item)=>{
            posts.push({
                ...item.toJSON(),
                me_gusta: item.users_likes.includes(idUser)
            })
        })

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

const buscarLenguaje = async(valor, idUser, info, res = response) =>{
    try {
        
        const leng_regex = new RegExp(valor, 'i')
        
        const resultados = await Post.find({lenguaje: leng_regex, estado: true})
                                .populate('autor', ['nombre','username','imgURL'])
                                .skip(info.salto)
                                .limit(info.limite)

        const total = await Post.countDocuments({lenguaje: leng_regex, estado: true})

        let posts = [];

        resultados.forEach((item)=>{
            posts.push({
                ...item.toJSON(),
                me_gusta: item.users_likes.includes(idUser)
            })
        })
        
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