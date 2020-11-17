const {userValidation} = require('./validations')
require("dotenv-safe").config();
const JWT = require('jsonwebtoken');
const { func } = require('joi');

module.exports = app => {
    const usersDB = app.data.users
    const controller = {}

    const {
        users: usersMock,
    } = usersDB

    controller.verifyJWT = (req, res, next) => {
        const token = req.headers['x-access-token']
        const {cpf} = req.body
        if(!token) return res.status(401).json({auth: false, message: 'No token provided.'})
    
        JWT.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) return res.status(500).json({auth: false, message: 'Failed to authenticate token.'})

            cpf = decoded.cpf
            next()
        })
    }

    controller.loginUsers = (req, res) => {
        const {cpf, senha} = req.body
        const findUser = usersMock.data.find((user) => user.cpf == cpf && user.senha == senha)
        
        if(findUser) {
            const token = JWT.sign({cpf}, process.env.SECRET, {
                expiresIn: 300
            })
            return res.json({auth: true, token: token})
        }

        res.status(500).json({message: 'Login inválido'})
    }

    controller.logoutUsers = (req, res) => {
        res.json({auth: false, token: null})
    }

    controller.listUsers = (req, res) => res.status(200).json(usersDB)

    controller.saveUsers = async (req, res, next) => {

        try{
            const user = await userValidation.validateAsync(req.body)
            
            usersMock.data.push(user)
            
            res.status(201).send(`User ${user.nome} added to the database!`)
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
    }

    controller.listCPFUsers = (req, res) => {
        const {cpf} = req.params

        const findUser = usersMock.data.find((user) => user.cpf == cpf)

        if(!findUser) {
            res.status(404).send('Usuário não encontrado.')
        } else {
            res.status(200).send(findUser)
        }
    }

    controller.deleteUsers = (req, res) => {
        const {cpf} = req.params

        const findUser = usersMock.data.find((user) => user.cpf == cpf)

        if(!findUser) {
            res.status(404).send('Usuário não encontrado.')
        } else {
            usersMock.data.splice(findUser, 1)
            res.status(200).send('Usuário deletado com sucesso!')
        }
    }
    
    return controller
}