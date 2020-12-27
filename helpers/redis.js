const redis = require('redis')

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
})

client.on('connect', () => {
    console.log('Client got connected');
})

client.on('error', (err) => {
    console.log(err.message);
})

client.on('ready', () => {
    console.log('Client got connected and is ready to use');
})

client.on('end', () => {
    console.log('Client got disconnected');
})

process.on('SIGINT', () => {
    client.quit()
})

module.exports = client