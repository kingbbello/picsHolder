const mongoose = require('mongoose')
require('dotenv').config()
const dbName = process.env.dbname
const password = process.env.password

mongoose.connect(`mongodb+srv://bsgCans:${password}@cluster0.hxeaw.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('mongodb connected');
}).catch(err => {
    console.log(err.message);
})

mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to db");
})

mongoose.connection.on('error', (err) => {
    console.log(err.message);
})

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose connection is disconnected");
})

process.on('SIGINT', async() => {
    await mongoose.connection.close()
    process.exit(0)
})

module.exports = mongoose.connection