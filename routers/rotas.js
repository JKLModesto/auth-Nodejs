const express = require('express')
const controllers = require('../controllers/controllers.js')
const middleware = require('../middleware/authMiddleware.js')

const router = express.Router()

//Rotas padrão
router.get('/', controllers.homepage)
router.post('/register', controllers.register)
router.post('/login', controllers.login)

//Rota Privada
router.get('/users', middleware.authenticate, controllers.listUsers)
router.put('/users/:username', middleware.authenticate, controllers.editUser)

module.exports = router;