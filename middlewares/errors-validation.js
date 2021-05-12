const { validationResult } = require('express-validator')


const checkErrors = (req, res, next) =>{
    
    const results = validationResult(req)

    if(!results.isEmpty()){
        return res.status(400).json({ok: false, results})
    }

    next()
}

module.exports = {
    checkErrors
}