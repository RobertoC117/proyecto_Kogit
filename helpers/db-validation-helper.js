const { Usuario, Post } = require('../models')


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
    return Usuario.findOne({_id: id, estado: true}).then(usuario =>{
        if(!usuario)
            return Promise.reject(`El usuario con id ${id} no existe`)
    })
}


const existePostId = (id = '') => {
    return Post.findOne({_id:id, estado: true}).then(post => {
        if(!post)
            return Promise.reject(`El post con el id ${id} no existe`)
    })
}

const verificarEmailEstado = (email = '') => {
    return Usuario.findOne({email, estado: true}).then(usuario => {
        if(!usuario)
            return Promise.reject(`El email ${email} no está asociado a ninguna cuenta`)
    })
}

module.exports = {
    existeUsername,
    existeEmail,
    existeUsuarioId,
    existePostId,
    verificarEmailEstado
}