const ApiController = require('../Controller/ApiController')
const { upload } = require('../helpers/grid')
const { verifyAccessToken } = require('../helpers/jwt')

const express = require("express")
const router = express.Router()

router.post('/upload', upload.single('file'), ApiController.upload)

router.get('/', ApiController.main)

router.delete('/files/:id', ApiController.delete)

module.exports = router