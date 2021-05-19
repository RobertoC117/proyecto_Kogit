const { response, request } = require("express");
const bcrypt = require('bcrypt')
const {Usuario} = require('../models');
const { createJWT } = require("../helpers/JWT-helper");

//Inicio de sesion
const logIn = async(req = request, res = response) => {

    try {

        const {termino, password} = req.body

        const usuario = await Usuario.findOne({
            $or:[{email: termino}, {username: termino}],
            $and: [{estado: true}]
        },{estado:0, pregunta:0, role:0})

        if(!usuario){
            return res.status(400).json({
                ok: false,
                errors:[
                    {
                        msg: 'Datos incorrectos (usuario o correo)'
                    }
                ]
            })
        }

        const match = await bcrypt.compare(password, usuario.password)

        if(!match){
            return res.status(400).json({
                ok: false,
                errors:[
                    {
                        msg: 'Datos incorrectos (password)'
                    }
                ]
            })
        }

        const token = await createJWT(usuario._id)

        const data = {
            ok: true,
            usuario,
            token
        }

        res.json(data)

        
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

}
//Registrar usuario(desde login)
const signUp = async(req = request, res = response) =>{
    try {
        const { nombre, username, password, email, telefono, pregunta, respuesta } = req.body;

        const salt = await bcrypt.genSalt(10)

        let data = {
            nombre,
            username,
            password: await bcrypt.hash(password, salt),
            email,
            telefono,
            pregunta,
            respuesta: await bcrypt.hash(respuesta, salt)
        }

        const newUser = new Usuario(data)

        await newUser.save()

        let token = await createJWT(newUser._id)

        res.json({
            ok: true,
            usuario: newUser,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = {
    signUp,
    logIn
}