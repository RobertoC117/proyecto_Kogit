const { request, response } = require("express")
const { infoBusquedas } = require("../helpers/others")
const { Post } = require("../models")

const getAllPosts = async(req = request, res = response) =>{
    try {
        const all = await Post.find(undefined, {comentarios:0, users_likes:0})
        res.json(all)
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const obtenerRepositorio = async(req = request, res = response) =>{
    try {
        const id = req.usuarioAutenticado._id
        const posts = await Post.find({autor:id, estado:true},'titulo texto lenguaje fecha likes tags',{sort:{fecha:"desc"}})
        res.json({
            ok: true,
            posts,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const MainPosts = async(req = request, res = response) => {
    try {
        const {seguidos, _id} = req.usuarioAutenticado
        let info = infoBusquedas(req)

        let respuesta = await Post.find({autor:{ $in: seguidos}, estado: true}, undefined, {sort:{fecha:"desc"}})
                            .populate('autor', ['nombre','username','imgURL'])
                            .skip(info.salto)
                            .limit(info.limite)

        const total = await Post.countDocuments({autor:{ $in: seguidos}, estado: true})

        let posts = [];//Todo lo que se hace con esta variables es por que lo que devuelve mongoose es inmutable 
                        //y no se puede añadir la propiedad me_gusta directamente

        respuesta.forEach((item)=>{
            posts.push({
                ...item.toJSON(),
                me_gusta: item.users_likes.includes(_id)
            })
        })

        res.json({
            ok:true,
            total,
            previous: info.previous,
            next: info.next,
            posts
        })

    } catch (error) {
        res.status(400).json({ok:false, errors:[{msg: error}]})
        console.log(error)
    }
}

const obtenerPost = async(req = request, res = response) => {
    try {
        const {id} = req.params //id del post
        const {_id} = req.usuarioAutenticado //id del usuario que hace la peticion
        const post = await Post.findById(id).populate('autor',['nombre','username','imgURL'])
                                .populate('comentarios.usuario',['nombre', 'username', 'imgURL']);

        let me_gusta = post.users_likes.includes(_id)
        
        res.json({
            ok:true,
            post:{
                me_gusta,
                ...post.toJSON()
            }
        })

    } catch (error) {
        res.status(400).json({ok:false, errors:[{msg: error}]})
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
                                .populate('autor',['nombre','username','imgURL'])
                                .populate('comentarios.usuario',['nombre', 'username', 'imgURL'])

        let me_gusta = post.users_likes.includes(comentario.usuario)

        res.json({
            ok: true,
            post:{
                me_gusta,
                ...post.toJSON()
            }
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const like = async(req = request, res = response) => {
    try {
        const {id_post} = req.params
        const {_id} = req.usuarioAutenticado
        let post = await Post.findById(id_post)

        console.log(_id)

        let me_gusta = post.users_likes.includes(_id)
        
        if(me_gusta)
        {
            post = await Post.findByIdAndUpdate(id_post, {$pull:{users_likes:_id}}, {new: true})
                            .populate('autor',['nombre','username','imgURL'])
                            .populate('comentarios.usuario',['nombre', 'username', 'imgURL'])

            return res.json({
                ok: true, 
                post:{
                    ...post.toJSON(),
                    me_gusta: false
                }
            })
        }

        post.users_likes.push(_id)
        await post.save()

        await post.populate('autor',['nombre','username','imgURL'])
                    .populate('comentarios.usuario',['nombre', 'username', 'imgURL']).execPopulate()

        return res.json({
            ok: true, 
            post:{
                ...post.toJSON(),
                me_gusta: true
            }
        })

    } catch (error) {
        res.status(400).json({ok:false, errors:[{msg: error}]})
        console.log(error)
    }
}

module.exports = {
    obtenerRepositorio,
    MainPosts,
    crearPost,
    obtenerPost,
    actualizarPost,
    eliminarPost,
    comentarPost,
    like,
    getAllPosts
}