const express = require('express')
const morgan = require('morgan')
const path = require("path");
const createError = require('http-errors')
const AuthRoute = require('./Routes/Auth.route')
const ApiRoute = require('./Routes/Api.route')
const client = require('./helpers/redis')

require('dotenv').config()
require('./helpers/init_mogodb')
const { verifyAccessToken } = require('./helpers/jwt')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get("/", verifyAccessToken, async(req, res, next) => {
//     res.send('Hello')
// })

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.use('/auth', AuthRoute)
app.use('/api', ApiRoute)

app.use(async(req, res, next) => {
    next(createError.NotFound("This route does not exists"))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})