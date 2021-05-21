const { request, response } = require('express')
const JWT = require('jsonwebtoken')
const { verifyJWT } = require('../helpers/JWT-helper')
const { Usuario } = require('../models')

const JWT_validator = async(req = request, res = response, next) =>{

    let token = req.header('token')

    //Si el token no viene en la request
    if(!token){
        return res.status(400).json({
            ok: false,
            errors:[
                {
                    msg: 'El token de autenticacion es requerido'
                }
            ]
        })
    }

    try {
        
        const data = await verifyJWT(token)
    
        const usuario = await Usuario.findById(data.uid)

        if(!usuario.estado){
            throw new Error('Este usuario no es valido (estado: false)')
        }

        req.usuarioAutenticado = usuario

        next()
        
    } catch (error) {
        console.log(error)
        res.status(401).json({ok:false, errors:[{msg: error}]})
    }
}

const recoveryJWT_validator = async(req = request, res = response, next) =>{

    let token = req.header('token')

    //Si el token no viene en la request
    if(!token){
        return res.status(400).json({
            ok: false,
            errors:[
                {
                    msg: 'El token de autenticacion es requerido'
                }
            ]
        })
    }

    try {
        
        const data = await verifyJWT(token, process.env.RECOVERY_SEED_GENERATION)
    
        const usuario = await Usuario.findById(data.uid)

        if(!usuario.estado){
            throw new Error('Este usuario no es valido (estado: false)')
        }

        req.dataToken = usuario

        next()
        
    } catch (error) {
        console.log(error)
        res.status(401).json({ok:false, errors:[{msg: error}]})
    }
}

module.exports = {
    JWT_validator,
    recoveryJWT_validator
}