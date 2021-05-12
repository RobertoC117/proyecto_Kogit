const { Schema, model } = require('mongoose')

const RoleSchema = new Schema({
    nombre:{
        type: String,
        required: true
    },
    descripcion:{
        type: String
    }
})

RoleSchema.methods.toJSON = function() {
    const {__v, password, _id, ...role} = this.toObject()
    role.uid = _id;
    return role;
}

module.exports = model('role', RoleSchema)