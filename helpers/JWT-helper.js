const JWT = require('jsonwebtoken')

const createJWT = (uid = '', seed = process.env.GENERATION_SEED, tiempo_exp = process.env.EXP_TIME_TOKEN) => {
    return new Promise((resolve, reject) =>{
        JWT.sign({uid}, seed,{expiresIn: tiempo_exp},(err, token)=>{

            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            }

            resolve(token)
        })
    })
}

const verifyJWT = (token, seed = process.env.GENERATION_SEED) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, seed, (err, data) =>{
            if(err){
                console.log(err)
                reject('Token no valido')
            }

            resolve(data)
        })
    })
}

module.exports = {
    createJWT,
    verifyJWT
}