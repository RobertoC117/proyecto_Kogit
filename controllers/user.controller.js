const { request, response } = require("express");
const { Usuario, Post } = require("../models");
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const obtenerPerfil = async(req = request, res = response) => {
    
    const { id } = req.params;
    const miID = req.usuarioAutenticado._id

    try {
    
        const user_data = await Usuario.findById(id,{estado:0, pregunta:0, role:0})
        const user_posts = await Post.find({autor: id})

        const seguido = user_data.seguidores.includes(miID)

        const data = {
            ok: true,
            usuario: {
                seguido,
                ...user_data.toJSON()
            },
            posts: user_posts
        }

        res.json(data)
        
    } catch (error) {
        
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})

    }
}

const obtenerMiPerfil = async(req = request, res = response) => {

    try {

        const id = req.usuarioAutenticado._id
        const user_data = await Usuario.findById(id, {estado:0, pregunta:0, role:0})

        const data = {
            ok: true,
            usuario: user_data,
        }

        res.json(data)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const actualizarMiPerfil = async(req = request, res = response) =>{
    try {
        //const {nombre, telefono, twitter, website, ubicacion, company} = req.body
        const {estado, pregunta, respuesta, imgURL, password, username, email, seguidores, seguidos, _id, ...resto} = req.body

        const id = req.usuarioAutenticado._id

        const user_data = await Usuario.findByIdAndUpdate(id, resto, {new: true, projection:{estado:0, pregunta:0, role:0}})
    
        const data = {
            ok: true,
            usuario: user_data,
        }
    
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const actualizarMiPassword = async(req = request, res = response) => {
    try {
        const { password, newpassword } = req.body

        const id = req.usuarioAutenticado._id;

        let user_data = await Usuario.findById(id)
        const match = await bcrypt.compare(password, user_data.password)

        if(!match){
            return res.status(400).json({
                ok: false,
                errors:[
                    {
                        msg:'La contraseña es incorrecta'
                    }
                ]
            })
        }

        const salt = await bcrypt.genSalt()
        const encriptada = await bcrypt.hash(newpassword, salt)

        user_data = await Usuario.findByIdAndUpdate(id, {password: encriptada}, {new: true, projection:{estado:0, pregunta:0, role:0}})

        const data = {
            ok: true,
            usuario: user_data,
        }

        res.json(data)

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const seguirUsuario = async(req = request, res = response) =>{
    try {
        const {id} = req.params
        const miID = req.usuarioAutenticado._id

        let perfil = await Usuario.findById(id)
        const posts = await Post.find({autor: id})
        let seguido = perfil.seguidores.includes(miID)

        if(seguido){
            perfil = await Usuario.findByIdAndUpdate(id,{ $pull:{ seguidores: miID } }, {new: true})
            await Usuario.findByIdAndUpdate(miID,{ $pull:{ seguidos: id } })
            return res.json({
                ok: true,
                usuario: {
                    seguido: false,
                    ...perfil.toJSON()
                },
                posts
            })
        }

        perfil.seguidores.push(miID)
        await perfil.save()
        await Usuario.findByIdAndUpdate(miID,{ $push:{seguidos: id} })
        return res.json({
            ok: true,
            usuario: {
                seguido: true,
                ...perfil.toJSON()
            },
            posts
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const updateImagen = async(req = request, res = response) => {
    try {
        const {tempFilePath, name} = req.files.archivo
        console.log(req.files.archivo)

        const extensionesValidas = ['png','jpg','jpeg','gif']

        let nombreArray = name.split('.')

        let extension = nombreArray[nombreArray.length -1]

        console.log(extension)

        if(!extensionesValidas.includes(extension)){
            return res.status(400).json({ok:false, errors:[{msg: "Tipo de archivo no valido"}]})
        }

        let usuario = await Usuario.findById(req.usuarioAutenticado._id)

        const {secure_url} = await cloudinary.uploader.upload(tempFilePath,{folder:"usuarios/"})

        if(usuario.imgURL){
            const arreglo_url = usuario.imgURL.split('/')
            let fullName = arreglo_url[arreglo_url.length - 2] + '/' + arreglo_url[arreglo_url.length - 1]
            let [id_imagen] = fullName.split('.')
            console.log(id_imagen)
            cloudinary.uploader.destroy(id_imagen)
        }

        usuario.imgURL = secure_url

        await usuario.save()

        res.json({
            ok: true,
            usuario
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

module.exports = {
    obtenerPerfil,
    obtenerMiPerfil,
    actualizarMiPerfil,
    actualizarMiPassword,
    seguirUsuario,
    updateImagen
}