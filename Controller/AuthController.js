const createError = require('http-errors')
const User = require('../Models/User')
const { authSchema } = require('../helpers/validationSchema')
const { signAccessToken, refreshAccessToken, verifyRefreshToken } = require('../helpers/jwt')
const { response } = require("express")
const client = require('../helpers/redis')

module.exports = {
    register: async(req, res, next) => {
        console.log(req.body);
        try {
            const result = await authSchema.validateAsync(req.body)

            const doesExist = await User.findOne({ email: result.email })
            if (doesExist) {
                throw createError.Conflict(`${result.email} is already registered`)
            }

            const user = new User(result)
            const savedUser = await user.save()
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await refreshAccessToken(savedUser.id)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) {
                error.status = 422
            }
            next(error)
        }
    },

    login: async(req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })

            if (!user) {
                throw createError.NotFound('User not registered')
            }

            const isMatch = await user.isValidPassword(result.password)

            if (!isMatch) {
                throw createError.Unauthorized('Username/password not valid')
            }

            const accessToken = await signAccessToken(user.id)
            const refreshToken = await refreshAccessToken(user.id)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) {
                return next(createError.BadRequest("Invalid Username/Password"))
            }
            next(error)
        }
    },

    refresh: async(req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                throw createError.BadRequest()
            }

            const userId = await verifyRefreshToken(refreshToken)
            const accessToken = await signAccessToken(userId)
            const newRefreshToken = await refreshAccessToken(userId)

            res.send({ accessToken, newRefreshToken })
        } catch (error) {
            next(error)
        }
    },

    logout: async(req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw createError.BadRequest()
            }

            const userId = await verifyRefreshToken(refreshToken)
            client.DEL(userId, (err, value) => {
                if (err) {
                    console.log(err.message);
                    throw createError.InternalServerError()
                }
                console.log(value);
                res.sendStatus(204)
            })
        } catch (err) {
            next(err)
        }
    },
}