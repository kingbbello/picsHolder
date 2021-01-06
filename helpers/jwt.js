const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./redis')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((res, rej) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = { expiresIn: "1h", issuer: "pickurpage.com", audience: userId }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    rej(createError.InternalServerError())
                } else {
                    res(token)
                }
            })
        })
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        console.log(token);
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))

            } else {
                req.payload = payload
                next()
            }
        })
    },

    refreshAccessToken: (userId) => {
        return new Promise((res, rej) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = { expiresIn: "1y", issuer: "pickurpage.com", audience: userId }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    rej(createError.InternalServerError())
                } else {
                    client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                        if (err) {
                            console.log(err.message);
                            rej(createError.InternalServerError())
                            return;
                        }
                        res(token)
                    })
                }
            })
        })
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            const secret = process.env.REFRESH_TOKEN_SECRET

            JWT.verify(refreshToken, secret, (err, payload) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.Unauthorized())
                } else {
                    const userId = payload.aud

                    client.get(userId, (err, res) => {
                        if (err) {
                            console.log(err.message);
                            reject(createError.InternalServerError())
                            return;
                        } else {
                            if (refreshToken === res) {
                                return resolve(userId)
                            } else {
                                reject(createError.Unauthorized())
                            }
                        }
                    })
                }
            })
        })
    }
}