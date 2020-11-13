const Joi = require('joi')

const userValidation = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(30)
        .required(),
        
    telefone: Joi.number()
        .integer()
        .positive()
        .required(),

    cpf: Joi.number()
        .integer()
        .positive()
        .required(),

    email: Joi.string()
        .email({tlds: {allow: ['com', 'net']}})
        .required(),

    dataNasc: Joi.date()
        .required()
        .max('12-31-2002'),

})

module.exports = {
    userValidation
}