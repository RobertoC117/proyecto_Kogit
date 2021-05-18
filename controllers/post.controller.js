const { request, response } = require("express")
const { Post } = require("../models")

const obtenerRepositorio = async(req = request, res = response) =>{
    try {
        const id = req.usuarioAutenticado._id
        const posts = await Post.find({autor:id, estado:true},'titulo texto lenguaje fecha likes tags')
        res.json({
            ok: true,
            posts,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
} 

const obtenerPost = async(req = request, res = response) => {
    try {
        const {id} = req.params
        const post = await Post.findById(id).populate('autor',['nombre','username','imgURL'])
                                .populate('comentarios.usuario',['nombre', 'username', 'imgURL'])
        res.json({
            ok:true,
            post
        })
    } catch (error) {
        console.log(error)
    }
}

const crearPost = async(req = request, res = response) => {
    try {
        const {titulo, texto, lenguaje, tags} = req.body;
        const id = req.usuarioAutenticado._id;
        let data = {
            titulo,
            texto,
            lenguaje,
            autor: id,
            tags
        }
        const new_post = new Post(data)
        await new_post.save()
        res.json({
            ok: true,
            post: new_post
        })
    } catch (error) {
        res.status(400).json({ok:false, errors:[{msg: error}]})
        console.log(error)
    }
}

const actualizarPost = async(req = request, res = response) => {
    try {
        const {likes, users_likes, comentarios, fecha, autor, estado, _id, ...data} = req.body
        const {id} = req.params

        const post = await Post.findByIdAndUpdate(id, data,{new: true})

        res.json({
            ok: true,
            post
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const eliminarPost = async(req = request, res = response) =>{
    try {
        const {id} = req.params

        const post = await Post.findByIdAndUpdate(id, {estado: false}, {new: true})

        res.json({
            ok: true,
            post
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const comentarPost = async(req = request, res = response) =>{
    try {
        const { id } = req.params;
        const { texto } = req.body;
        const comentario = {
            usuario: req.usuarioAutenticado._id,
            texto
        }
        const post = await Post.findByIdAndUpdate(id, {$push:{comentarios:comentario}}, {new: true})
                                .populate('comentarios.usuario',['nombre', 'username', 'imgURL'])

        res.json({
            ok: true,
            post
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

module.exports = {
    obtenerRepositorio,
    crearPost,
    obtenerPost,
    actualizarPost,
    eliminarPost,
    comentarPost
}