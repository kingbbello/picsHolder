const JWT = require('jsonwebtoken')
const createError = require('http-errors')


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((res, rej) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = { expiresIn: "2s", issuer: "pickurpage.com", audience: userId }

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

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized())
            } else {
                req.payload = payload
                next()
            }
        })
    }
}