const JWT = require('jsonwebtoken')
const createError = require('http-errors')


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((res, rej) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = { expiresIn: "1h", issuer: "pickurpage.com", audience: userId }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    rej(err)
                } else {
                    res(token)
                }
            })
        })
    }
}