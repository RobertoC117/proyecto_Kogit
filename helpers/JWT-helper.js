const JWT = require('jsonwebtoken')

const createJWT = (uid = '') => {
    return new Promise((resolve, reject) =>{
        JWT.sign({uid}, process.env.GENERATION_SEED,{expiresIn: process.env.EXP_TIME_TOKEN},(err, token)=>{

            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            }

            resolve(token)
        })
    })
}

module.exports = {
    createJWT,
}