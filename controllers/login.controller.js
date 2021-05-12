const { response, request } = require("express");
const bcrypt = require('bcrypt')
const {Usuario} = require('../models');
const { createJWT } = require("../helpers/JWT-helper");

//Registrar usuario(desde login)
const signUp = async(req = request, res = response) =>{
    try {
        const { nombre, username, password, email, telefono } = req.body;

        const salt = await bcrypt.genSalt(10)

        let data = {
            nombre,
            username,
            password: await bcrypt.hash(password, salt),
            email,
            telefono
        }

        const newUser = new Usuario(data)

        await newUser.save()

        let token = await createJWT(newUser._id)

        res.json({
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
}