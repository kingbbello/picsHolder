const AuthController = require('../Controller/AuthController')

const express = require("express")
const router = express.Router()

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/refresh-token', AuthController.refresh)

router.delete('/logout', AuthController.logout)

module.exports = router