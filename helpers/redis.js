const redis = require('redis')

const client = redis.createClient({
    port: 16109,
    host: 'ec2-174-129-249-71.compute-1.amazonaws.com',
    password: 'p810ab01af0039611af085e24e0bc21b3a24a57bd1fc0f521782197a75d3f4f27'
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