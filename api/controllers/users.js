module.exports = app => {
    const {userValidation} = require('./validations')
    require("dotenv-safe").config();
    const JWT = require('jsonwebtoken');
    const { func } = require('joi');
    const {models, connectDb} = require('../models/index');
    const controller = {}

    controller.verifyJWT = (req, res, next) => {
        const token = req.body.token || req.query.token || req.headers['x-access-token']

        if(token) {
            JWT.verify(token, process.env.SECRET, function(err, decoded) {
                if(err) {
                    return res.json({success: false, message: 'Failed to authenticate token'})
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            })
        }
        
        /* if(!token) return res.status(401).json({auth: false, message: 'No token provided.'})
    
        JWT.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) return res.status(500).json({auth: false, message: 'Failed to authenticate token.'})

            req.cpf = decoded.cpf
            next()
        }) */
    }

    controller.loginUsers = async (req, res) => {
        connectDb().then(async () => {
            const {cpf, senha} = req.body
            const findUser = await models.User.findByLogin(cpf, senha)
            
            if(findUser) {
                const token = JWT.sign({cpf}, process.env.SECRET, {
                    expiresIn: 300
                })
                return res.json({auth: true, token: token})
            }
    
            res.status(500).json({message: 'Login inválido'})
        })
    }

    controller.logoutUsers = (req, res) => {
        connectDb().then(async () => {
            res.json({auth: false, token: null})
        })
    }

    controller.listUsers = async (req, res) => {
        connectDb().then(async () => {
            const listUsers = await models.User.find().exec()
            res.status(200).send(listUsers)
        })
    }

    controller.saveUsers = async (req, res, next) => {
        connectDb().then(async () => {
            try {
                const {cpf} = req.body
                const findUser = await models.User.findByCpf(cpf)

                if(findUser) {
                    res.status(200).send(`Usuário ${models.User.nome} já está cadastrado!`)
                } else {
                    const userVerify = await userValidation.validateAsync(req.body)
                    const userAdd = new models.User(userVerify)

                    userAdd.save().then(data => {
                        res.status(200).json(data)
                    })
                }
            } catch (error) {
                if (error.isJoi === true ) error.status = 422 && res.send(error.message)
        
                    next(error)
            }
    
            /* usersMock.data.push({
                nome: req.body.nome,
                telefone: req.body.telefone,
                cpf: req.body.cpf,
                email: req.body.email,
                dataNasc: req.body.dataNasc,
            })
    
            res.status(201).json(usersMock) */
        })
    }

    controller.listCPFUsers = async (req, res) => {
        connectDb().then(async () => {
            const {cpf} = req.params

            const findUser = await models.User.findByCpf(cpf)
    
            if(!findUser) {
                res.status(404).send('Usuário não encontrado.')
            } else {
                res.status(200).send(findUser)
            }
        })
    }

    controller.deleteUsers = async (req, res) => {
        connectDb().then(async () => {
            const {cpf} = req.params
            const findUser = await models.User.findByCpf(cpf)
    
            if(!findUser) {
                res.status(404).send('Usuário não encontrado.')
            } else {
                await models.User.deleteOne({cpf: cpf}, function(err, result){
                    if(err)
                        res.send(err)
                    else
                        res.status(200).send(result)
                })
            }
        })
    }
    
    return controller
}