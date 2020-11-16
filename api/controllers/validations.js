const Joi = require('joi')

const userValidation = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(30)
        .required(),
        
    telefone: Joi.string()
        .min(10)
        .max(10)
        .required(),

    cpf: Joi.string()
        .min(11)
        .min(11)
        .required(),

    email: Joi.string()
        .email({tlds: {allow: ['com', 'net']}})
        .required(),

    dataNasc: Joi.date()
        .raw()
        .required(),

})

module.exports = {
    userValidation
}