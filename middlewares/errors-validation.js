const { validationResult } = require('express-validator')


const checkErrors = (req, res, next) =>{
    
    const results = validationResult(req)

    if(!results.isEmpty()){
        return res.status(400).json({ok: false, errors: results.errors})
    }

    next()
}

module.exports = {
    checkErrors
}