const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const AuthRoute = require('./Routes/Auth.route')

require('dotenv').config()
require('./helpers/init_mogodb')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", async(req, res, next) => {
    res.send('Hello')
})

app.use('/auth', AuthRoute)

app.use(async(req, res, next) => {
    // const error = new Error("Not found")
    // error.status = 404
    // next(error)
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