const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    username:{
        type: String,
        required: [true, 'El username es requerido'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'El password es requerido'],
    },
    email:{
        type: String,
        required: [true, 'El username es requerido'],
        unique: true
    },
    telefono:{
        type: String,
        required: [true, 'El telefono es requerido']
    },
    company:{
        type: String
    },
    website:{
        type: String
    },
    twitter:{
        type: String
    },
    ubicacion:{
        type: String
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    },
    imgURL:{
        type: String,
        required: false
    },
    seguidores:[{type:Schema.Types.ObjectId, ref:'user'}],
    seguidos:[{type:Schema.Types.ObjectId, ref:'user'}],
    role:{
        type: Schema.Types.ObjectId,
        ref:'role'
    },
    posts:[{type:Schema.Types.ObjectId, ref:'post'}],
})

UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject()
    usuario.uid = _id;
    return usuario;
}

module.exports = model('user', UserSchema)