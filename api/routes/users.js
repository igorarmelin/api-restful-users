const {verifyJWT} = require('../controllers/users')

module.exports = app => {
    const controller = app.controllers.users

    app.route('/users', verifyJWT)
        .get(controller.listUsers)
        .post(controller.saveUsers)

    app.route('/users/:cpf', verifyJWT)
        .get(controller.listCPFUsers)
        .delete(controller.deleteUsers)
    
    app.route('/login')
        .post(controller.loginUsers)

    app.route('/logout')
        .post(controller.logoutUsers)
}