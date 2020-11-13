const {userValidation} = require('./validations')

module.exports = app => {
    const usersDB = app.data.users
    const controller = {}

    const {
        users: usersMock,
    } = usersDB

    controller.listUsers = (req, res) => res.status(200).json(usersDB)

    controller.saveUsers = (req, res) => {
        usersMock.data.push({
            nome: req.body.nome,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            email: req.body.email,
            dataNasc: req.body.dataNasc,
        })

        res.status(201).json(usersMock)
    }

    controller.listCPFUsers = (req, res) => {
        const {cpf} = req.params

        const findUser = usersMock.data.find((user) => user.cpf === cpf)

        if(!findUser) {
            res.status(404).send('Usuário não encontrado.')
        } else {
            res.status(200).send(findUser)
        }
    }

    controller.deleteUsers = (req, res) => {
        const {cpf} = req.params

        const findUser = usersMock.data.find((user) => user.cpf === cpf)

        if(!findUser) {
            res.status(404).send('Usuário não encontrado.')
        } else {
            usersMock.data.splice(findUser, 1)
            res.status(200).send('Usuário deletado com sucesso!')
        }
    }
    
    return controller
}