

const isPhoneNumber = (telefono = '') =>{
    const regexPhone = new RegExp(/^[+]*[(]?[0-9\s\.]{1,4}[)]?[0-9-\s\.]{10}$/)

    if(!regexPhone.test(telefono)){
        throw new Error(`${telefono} no tiene un formato de numero de telefono valido`)
    }

    return true
}

const isSecurePassword = (password = '') => {
    const regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,20}$/)

    if(!regexPassword.test(password)){
        throw new Error('La contraseña debe contener al menos un caracter especial($@$!%*?&), una mayuscula y algun numero')
    }

    return true;
}

module.exports = {
    isPhoneNumber,
    isSecurePassword
}