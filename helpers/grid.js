const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const crypto = require('crypto');
const path = require('path');
const multer = require('multer')


const conn = require('./init_mogodb');
require('dotenv').config()
const dbName = process.env.dbname
const password = process.env.password

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
    console.log('added Grid');
})

const storage = new GridFsStorage({
    url: `mongodb+srv://bsgCans:${password}@cluster0.hxeaw.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(8, (err, buf) => {
                if (err) {
                    return reject(err)
                }

                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})

const upload = multer({ storage })

module.exports = upload