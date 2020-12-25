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


// userSchema.post('save', async function(next) {
//     try {
//         console.log('called after saving');
//     } catch (error) {
//         next(error)
//     }
// })

const User = mongoose.model('user', userSchema)

module.exports = User