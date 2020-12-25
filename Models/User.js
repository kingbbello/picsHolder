const mongoose = require('mongoose')
const bycrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function(next) {
    try {
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
        console.log(this.email, this.password)
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bycrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user', userSchema)

module.exports = User