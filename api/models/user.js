const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        telefone: {
            type: String,
            required:true,
        },
        cpf: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        dataNasc: {
            type: String,
            required: true,
        },
        senha: {
            type: String,
            required: true,
        },
    },
    {timestamps: true},
)

userSchema.statics.findByLogin = async function (cpf, senha) {
    let user = await this.findOne({
      cpf: cpf,
      senha: senha
    });
   
    return user;
};

userSchema.statics.findByCpf = async function (cpf) {
    let user = await this.findOne({
        cpf: cpf,
    });

    return user;
};

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}