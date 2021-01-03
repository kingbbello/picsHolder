const AuthController = require('../Controller/ApiController')
const upload = require('../helpers/grid')

const express = require("express")
const router = express.Router()

router.post('/upload', upload.single('file'), AuthController.upload)

module.exports = router