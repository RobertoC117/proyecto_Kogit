const bcrypt = require('bcrypt')
const { response, request } = require("express");
const { createJWT } = require('../helpers/JWT-helper');
const { Usuario } = require("../models");
const transporter = require('../config/mailer_config')

const confirmEmail = async(req = request, res = response) =>{

    const {email} = req.body

    const data = await Usuario.findOne({email},{_id:1})

    res.json({
        ok: true,
        data
    })
}

const preguntar = async(req = request, res = response) =>{
    const {id} = req.params
    
    const data = await Usuario.findById(id, {pregunta:1})
    
    res.json({
        ok: true,
        data
    })
}

const responder = async(req = request, res = response) =>{
    try {
        const {respuesta} = req.body
        const {id} = req.params
    
        const data = await Usuario.findById(id, {respuesta:1})
    
        const match = await bcrypt.compare(respuesta, data.respuesta)
    
        if(!match){
            return res.status(400).json({
                ok: true,
                errors:[
                    {
                        msg:"La respuesta es incorrecta"
                    }
                ]
            })
        }
        //Generar el token
        const token = await createJWT(data._id, process.env.RECOVERY_SEED_GENERATION, process.env.EXP_TIME_RECOVERY_TOKEN)
    
        res.json({
            ok: true,
            data:{
                uid: data._id
            },
            key: token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

const sendRecoveryEmail = async(req = request, res = response) =>{
    const {id} = req.params
    let {url} = req.body
    try {

        const data = await Usuario.findById(id,{email:1, username:1})

        const token = await createJWT(data._id, process.env.RECOVERY_SEED_GENERATION, process.env.EXP_TIME_RECOVERY_TOKEN)

        url = url + '?key=' + token

        let estructura = {
            from: '"KoGit 👻👾" <noreply@kogit.com>', // sender address
            to: data.email, // list of receivers
            subject: "Recuperacion de contraseña", // Subject line
            html: `<html>
                <body>
                    <b>Se ha solicitado el restablecimiento de contraseña. La ventana de restablecimiento de contraseña está limitada a una hora.</b><br>
                    <br>
                    <b>Si no restablece su contraseña en una hora, deberá enviar una nueva solicitud.</b><br>
                    <br>
                    <b>Para completar el proceso de restablecimiento de contraseña, visite el siguiente enlace:</b><br>
                    <br>
                    <a href="${url}">${url}</a><br>
                    <br>
                    <p>Username: ${data.username}</p><br>
                    <p>Creado: ${new Date().toUTCString()}</p>
                </body>
            </html>`
        }

        await transporter.sendMail(estructura)

        res.json({
            ok: true,
            msg: `Se ha enviado un correo de verificacion a la direccion ${data.email}`
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }

}

const resetPassword = async(req = request, res = response) =>{
    try {
        const {_id} = req.dataToken
        const { newpassword } = req.body

        const salt = await bcrypt.genSalt()
        const password = await bcrypt.hash(newpassword, salt)
        
        await Usuario.findByIdAndUpdate(_id, {password})

        res.json({
            ok: true,
            id:_id
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ok:false, errors:[{msg: error}]})
    }
}

module.exports = {
    confirmEmail,
    preguntar,
    responder,
    sendRecoveryEmail,
    resetPassword
}