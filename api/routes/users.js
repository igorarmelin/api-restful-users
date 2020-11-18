module.exports = app => {
    const controller = app.controllers.users

    app.route('/users')
        .get(controller.verifyJWT, controller.listUsers)
        .post(controller.verifyJWT, controller.saveUsers)

    app.route('/users/:cpf')
        .get(controller.verifyJWT, controller.listCPFUsers)
        .delete(controller.verifyJWT, controller.deleteUsers)
    
    app.route('/login')
        .post(controller.loginUsers)

    app.route('/logout')
        .post(controller.logoutUsers)
}