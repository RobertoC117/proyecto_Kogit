const { Usuario } = require('../models')


const existeUsername = async(username = '') => {
    return Usuario.findOne({username}).then(usuario => {
        if(usuario)
            return Promise.reject(`El nombre de usuario ${username} ya ha sido utilizado`)
    })
}

const existeEmail = (email = '') => {
    return Usuario.findOne({email}).then(usuario => {
        if(usuario)
            return Promise.reject(`El email ${email} ya ha sido utilizado`)
    })
}

const existeUsuarioId = (id = '') => {
    return Usuario.findById(id).then(usuario =>{
        if(!usuario)
            return Promise.reject(`El usuario con id ${id} no existe`)
    })
}

module.exports = {
    existeUsername,
    existeEmail,
    existeUsuarioId
}