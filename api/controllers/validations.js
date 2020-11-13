const Joi = require('joi')

const userValidation = Joi.object({
    nomeVal: Joi.string()
        .min(2)
        .max(30)
        .required(),
        
    telefoneVal: Joi.number()
        .integer()
        .positive()
        .max(11)
        .min(10)
        .required(),

    cpfVal: Joi.number()
        .integer()
        .positive()
        .max(11)
        .min(11)
        .required(),

    emailVal: Joi.string()
        .email({tlds: {allow: ['com', 'net']}})
        .required(),

    nascimentoVal: Joi.date()
        .format('DD-MM-YYYY')
        .raw()
        .required(),

})

module.exports = {
    userValidation
}