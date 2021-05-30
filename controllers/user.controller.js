const { request, response } = require("express");
const { Usuario, Post } = require("../models");
const bcrypt = require('bcrypt')

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
        const {password, username, email, seguidores, seguidos, _id, ...resto} = req.body

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

module.exports = {
    obtenerPerfil,
    obtenerMiPerfil,
    actualizarMiPerfil,
    actualizarMiPassword,
    seguirUsuario
}